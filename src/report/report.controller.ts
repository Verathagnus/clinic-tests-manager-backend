import { Controller, Get } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('edits')
  async generateEditsReport() {
    const reportFilePath = await this.reportService.generateEditsReport();
    return { message: 'Edits report generated successfully', filePath: reportFilePath };
  }

  @Get('invoices')
  async generateInvoicesReport() {
    const reportFilePath = await this.reportService.generateInvoicesReport();
    return { message: 'Invoices report generated successfully', filePath: reportFilePath };
  }
}