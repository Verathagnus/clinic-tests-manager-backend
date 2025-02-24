import { Controller, Get, Res, Query } from '@nestjs/common';
import { ReportService } from './report.service';
import { Response } from 'express';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('edits')
  async generateEditsReport(
    @Res() res: Response,
    @Query('format') format: string = 'csv', // Default to CSV
  ) {
    const reportStream = await this.reportService.generateEditsReportStream(format);

    // Set response headers based on the format
    if (format === 'xlsx') {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=edits_report_${new Date().toISOString()}.xlsx`);
    } else {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=edits_report_${new Date().toISOString()}.csv`);
    }

    // Pipe the report stream to the response
    reportStream.pipe(res);

    // Handle stream errors
    reportStream.on('error', (err) => {
      console.error('Error streaming edits report:', err);
      res.status(500).send('Failed to generate edits report');
    });
  }

  @Get('invoices')
  async generateInvoicesReport(
    @Res() res: Response,
    @Query('format') format: string = 'csv', // Default to CSV
  ) {
    const reportStream = await this.reportService.generateInvoicesReportStream(format);

    // Set response headers based on the format
    if (format === 'xlsx') {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=invoices_report_${new Date().toISOString()}.xlsx`);
    } else {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=invoices_report_${new Date().toISOString()}.csv`);
    }

    // Pipe the report stream to the response
    reportStream.pipe(res);

    // Handle stream errors
    reportStream.on('error', (err) => {
      console.error('Error streaming invoices report:', err);
      res.status(500).send('Failed to generate invoices report');
    });
  }
}