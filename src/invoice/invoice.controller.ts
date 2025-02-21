// src/invoice/invoice.controller.ts
import { Controller, Post, Get, Body, Param, Query, Response, Header, StreamableFile, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InvoiceService } from './invoice.service';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) { }

  @Post()
  async createInvoice(@Body() createInvoiceDto: {
    patient: {
      name: string;
      age: number;
      address: string;
      phone: string;
    };
    items: { id: number; price: number }[];
    discount: number;
    amountPaid: number;
    remarks: string;
  }) {
    return this.invoiceService.createInvoiceWithPatient(
      createInvoiceDto.patient,
      createInvoiceDto.items,
      createInvoiceDto.discount,
      createInvoiceDto.amountPaid,
      createInvoiceDto.remarks
    );
  }

  @Get(':id/print-details')
  async getInvoiceDetails(@Param('id') id: number) {
    return this.invoiceService.getInvoicePrintDetails(id);
  }

  @Get(':id/print')
@Header('Content-Type', 'application/pdf')
@Header('Content-Disposition', 'attachment; filename="invoice.pdf"')
async printInvoice(
  @Param('id') id: number
): Promise<StreamableFile> {
  try {
    // Check if the invoice exists
    const invoice = await this.invoiceService.getInvoicePrintDetails(id);
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    // Generate the PDF
    const buffer = await this.invoiceService.printInvoice(id);
    return new StreamableFile(buffer);
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error; // Re-throw the NotFoundException
    }
    // Log the error for debugging purposes
    console.error('Error in printInvoice:', error);
    // Throw a more descriptive HttpException
    throw new HttpException('Failed to print invoice', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

  @Get()
  async getInvoices(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.invoiceService.getInvoices(page, limit, startDate, endDate);
  }

  @Post(':id/pay-balance')
  async payBalance(
    @Param('id') id: number,
    @Body() paymentDto: { amount: number }
  ) {
    return this.invoiceService.payBalance(id, paymentDto.amount);
  }

  @Post(':id/update-discount')
  async updateDiscount(
    @Param('id') id: number,
    @Body() discountDto: { discount: number }
  ) {
    return this.invoiceService.updateDiscount(id, discountDto.discount);
  }
}