import { Injectable, Inject } from '@nestjs/common';
import postgres from 'postgres';
import { PassThrough } from 'stream';
import { stringify } from 'csv-stringify';
import ExcelJS from 'exceljs';

@Injectable()
export class ReportService {
  constructor(@Inject('DATABASE_CONNECTION') private sql: postgres.Sql<any>) {}

  async generateEditsReportStream(format: string): Promise<PassThrough> {
    const edits = await this.sql`SELECT * FROM edits ORDER BY created_at DESC`;
    const columns = ['id', 'entity_name', 'entity_id', 'before', 'after', 'created_at'];
    const data = edits.map(edit => columns.map(column => edit[column]));

    const stream = new PassThrough();

    if (format === 'xlsx') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Edits Report');

      // Add headers
      worksheet.addRow(columns);

      // Add data rows
      data.forEach(row => worksheet.addRow(row));

      // Write the workbook to the stream
      await workbook.xlsx.write(stream);
      stream.end();
    } else {
      const stringifier = stringify({ header: true, columns });
      stringifier.pipe(stream);

      for (const row of data) {
        stringifier.write(row);
      }

      stringifier.end();
    }

    return stream;
  }

  async generateInvoicesReportStream(format: string): Promise<PassThrough> {
    const invoices = await this.sql`
      SELECT 
        i.id, 
        i.patient_id, 
        i.discount, 
        i.amount_paid, 
        i.remarks, 
        i.created_at, 
        i.deleted_at,
        p.name AS patient_name, 
        p.age, 
        p.address, 
        p.phone,
        json_agg(json_build_object('name', it.name, 'price', ii.price)) AS items
      FROM invoices i
      JOIN patients p ON i.patient_id = p.id
      LEFT JOIN invoice_items ii ON i.id = ii.invoice_id
      LEFT JOIN items it ON ii.item_id = it.id
      WHERE i.deleted_at IS NULL
      GROUP BY i.id, p.id
      ORDER BY i.created_at DESC
    `;

    const columns = [
      'id',
      'patient_name',
      'age',
      'address',
      'phone',
      'discount',
      'amount_paid',
      'remarks',
      'created_at',
      'items',
    ];

    const data = invoices.map(invoice => [
      invoice.id,
      invoice.patient_name,
      invoice.age,
      invoice.address,
      invoice.phone,
      invoice.discount,
      invoice.amount_paid,
      invoice.remarks,
      invoice.created_at,
      JSON.stringify(invoice.items),
    ]);

    const stream = new PassThrough();

    if (format === 'xlsx') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Invoices Report');

      // Add headers
      worksheet.addRow(columns);

      // Add data rows
      data.forEach(row => worksheet.addRow(row));

      // Write the workbook to the stream
      await workbook.xlsx.write(stream);
      stream.end();
    } else {
      const stringifier = stringify({ header: true, columns });
      stringifier.pipe(stream);

      for (const row of data) {
        stringifier.write(row);
      }

      stringifier.end();
    }

    return stream;
  }
}