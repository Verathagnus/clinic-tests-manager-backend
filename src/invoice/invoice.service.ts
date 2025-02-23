// src/invoice/invoice.service.ts
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import postgres from 'postgres';
import * as puppeteer from 'puppeteer';
import { htmlContentTemplate } from 'src/templates/invoice.template';
// import { getBrowser } from 'src/utils/browser';

@Injectable()
export class InvoiceService {
  constructor(@Inject('DATABASE_CONNECTION') private sql: postgres.Sql<any>) { }

  async createInvoice(
    patientId: number,
    items: { id: number; price: number }[],
    discount: number,
    amountPaid: number,
    remarks: string
  ) {
    try {
      const result = await this.sql.begin(async (transaction) => {
        const [invoice] = await transaction`
          INSERT INTO invoices (patient_id, discount, amount_paid, remarks)
          VALUES (${patientId}, ${discount}, ${amountPaid}, ${remarks})
          RETURNING id
        `;
        const invoiceId = invoice.id;

        for (const item of items) {
          await transaction`
            INSERT INTO invoice_items (invoice_id, item_id, price)
            VALUES (${invoiceId}, ${item.id}, ${item.price})
          `;
        }

        return invoice;
      });

      return result;
    } catch (error) {
      throw new Error(`Failed to create invoice: ${error.message}`);
    }
  }

  async createInvoiceWithPatient(
    patientData: {
      name: string;
      age: number;
      address: string;
      phone: string;
    },
    items: { id: number; price: number }[],
    discount: number,
    amountPaid: number,
    remarks: string
  ) {
    try {
      return await this.sql.begin(async (transaction) => {
        // Create patient
        const [patient] = await transaction`
          INSERT INTO patients (name, age, address, phone)
          VALUES (${patientData.name}, ${patientData.age}, ${patientData.address}, ${patientData.phone})
          RETURNING *
        `;

        // Create invoice
        const [invoice] = await transaction`
          INSERT INTO invoices (patient_id, discount, amount_paid, remarks)
          VALUES (${patient.id}, ${discount}, ${amountPaid}, ${remarks})
          RETURNING *
        `;

        // Add invoice items
        for (const item of items) {
          await transaction`
            INSERT INTO invoice_items (invoice_id, item_id, price)
            VALUES (${invoice.id}, ${item.id}, ${item.price})
          `;
        }

        // Return complete invoice data
        const [completeInvoice] = await transaction`
          SELECT 
            i.*,
            p.name as patient_name,
            p.age as patient_age,
            p.address as patient_address,
            p.phone as patient_phone,
            json_agg(
              json_build_object(
                'id', it.id,
                'name', it.name,
                'price', ii.price
              )
            ) as items
          FROM invoices i
          JOIN patients p ON i.patient_id = p.id
          JOIN invoice_items ii ON i.id = ii.invoice_id
          JOIN items it ON ii.item_id = it.id
          WHERE i.id = ${invoice.id}
          GROUP BY i.id, p.id
        `;

        return completeInvoice;
      });
    } catch (error) {
      throw new Error(`Failed to create invoice: ${error.message}`);
    }
  }

  async getInvoicePrintDetails(invoiceId: number) {
    const [invoice] = await this.sql`
      SELECT 
        i.*,
        p.name as patient_name,
        p.age as patient_age,
        p.address as patient_address,
        p.phone as patient_phone,
        json_agg(
          json_build_object(
            'name', it.name,
            'description', it.description,
            'price', ii.price
          )
        ) as items
      FROM invoices i
      JOIN patients p ON i.patient_id = p.id
      JOIN invoice_items ii ON i.id = ii.invoice_id
      JOIN items it ON ii.item_id = it.id
      WHERE i.id = ${invoiceId}
      GROUP BY i.id, p.id
    `;

    // Update print count
    await this.sql`
      UPDATE invoices
      SET print_count = print_count + 1
      WHERE id = ${invoiceId}
    `;

    return invoice;
  }


  async printInvoice(invoiceId: number) {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      
      // Fetch the invoice data from your database or service
      const invoice = await this.getInvoicePrintDetails(invoiceId);
      
      const companyName = process.env.COMPANY_NAME || "";
      const companyNumber = process.env.COMPANY_NUMBER || "";
      const companyAddress = process.env.COMPANY_ADDRESS || "";
      let discountSection = "";
      if (invoice.discount != 0) {
        discountSection = `<div class="summary-item">
        <span>DISCOUNT:</span>
        <span>₹${invoice.discount}</span>
      </div>
      <div class="summary-item total-item">
        <span>GRAND TOTAL:</span>
        <span>₹${invoice.items.reduce((total, item) => total + item.price, 0) - invoice.discount}</span>
      </div>`
      }
      console.log("Test1")
      const htmlContent = htmlContentTemplate({companyName, companyNumber, companyAddress, invoice, discountSection});
      console.log("Test2")

      await page.setContent(htmlContent);
      const pdfBuffer = await page.pdf({ format: 'A5' });
      await browser.close();
      return pdfBuffer;
    }
    catch (e) {
      throw new Error("Error in printInvoice"+e.message);
    }
  }


  async getInvoices(page: number, limit: number, startDate?: string, endDate?: string) {
    const offset = (page - 1) * limit;
    let dateFilter = this.sql``;

    if (startDate && endDate) {
      dateFilter = this.sql`AND i.created_at BETWEEN ${startDate} AND ${endDate}`;
    } else if (startDate) {
      dateFilter = this.sql`AND i.created_at >= ${startDate}`;
    } else if (endDate) {
      dateFilter = this.sql`AND i.created_at <= ${endDate}`;
    }

    const totalInvoices = await this.sql`
      SELECT COUNT(*) FROM invoices i
      WHERE i.deleted_at IS NULL ${dateFilter}
    `;

    const totalPages = Math.ceil(totalInvoices[0].count / limit);

    const invoices = await this.sql`
      SELECT i.id, i.patient_id, i.discount, i.amount_paid, i.remarks, i.created_at, i.deleted_at,
             p.name AS patient_name, p.age, p.address, p.phone,
             json_agg(json_build_object('name', it.name, 'price', ii.price)) AS items
      FROM invoices i
      JOIN patients p ON i.patient_id = p.id
      LEFT JOIN invoice_items ii ON i.id = ii.invoice_id
      LEFT JOIN items it ON ii.item_id = it.id
      WHERE i.deleted_at IS NULL ${dateFilter}
      GROUP BY i.id, p.id
      ORDER BY i.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    return {
      currentPage: page,
      totalPages,
      totalInvoices: totalInvoices[0].count,
      invoices,
    };
  }

  async payBalance(invoiceId: number, amount: number) {
    // First, get the current invoice
    const [invoice] = await this.sql`
      SELECT * FROM invoices
      WHERE id = ${invoiceId} AND deleted_at IS NULL
    `;

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${invoiceId} not found`);
    }

    // Store the before state
    const beforeState = { ...invoice };

    // Update the amount paid
    const [updatedInvoice] = await this.sql`
      UPDATE invoices
      SET amount_paid = amount_paid + ${amount}
      WHERE id = ${invoiceId}
      RETURNING *
    `;

    // Log the edit
    await this.sql`
      INSERT INTO edits (entity_name, entity_id, before, after)
      VALUES ('invoices', ${invoiceId}, ${this.sql.json(beforeState)}, ${this.sql.json(updatedInvoice)})
    `;

    return updatedInvoice;
  }

  async updateDiscount(invoiceId: number, discount: number) {
    // First, get the current invoice
    const [invoice] = await this.sql`
      SELECT * FROM invoices
      WHERE id = ${invoiceId} AND deleted_at IS NULL
    `;

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${invoiceId} not found`);
    }

    // Store the before state
    const beforeState = { ...invoice };

    // Update the discount
    const [updatedInvoice] = await this.sql`
      UPDATE invoices
      SET discount = ${discount}
      WHERE id = ${invoiceId}
      RETURNING *
    `;

    // Log the edit
    await this.sql`
      INSERT INTO edits (entity_name, entity_id, before, after)
      VALUES ('invoices', ${invoiceId}, ${this.sql.json(beforeState)}, ${this.sql.json(updatedInvoice)})
    `;

    return updatedInvoice;
  }

}