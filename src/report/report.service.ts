import { Injectable, Inject } from '@nestjs/common';
import postgres from 'postgres';
import * as fs from 'fs';
import * as path from 'path';
import { stringify } from 'csv-stringify';

@Injectable()
export class ReportService {
  constructor(@Inject('DATABASE_CONNECTION') private sql: postgres.Sql<any>) {}

  async generateEditsReport(): Promise<string> {
    const reportDir = path.join(__dirname, '..', 'reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const reportFilePath = path.join(reportDir, `edits_report_${new Date().toISOString()}.csv`);

    const edits = await this.sql`SELECT * FROM edits ORDER BY created_at DESC`;

    const columns = ['id', 'entity_name', 'entity_id', 'before', 'after', 'created_at'];
    const data = edits.map(edit => columns.map(column => edit[column]));

    const writableStream = fs.createWriteStream(reportFilePath);
    const stringifier = stringify({ header: true, columns });
    stringifier.pipe(writableStream);

    for (const row of data) {
      stringifier.write(row);
    }

    stringifier.end();
    return reportFilePath;
  }

  async generateInvoicesReport(): Promise<string> {
    const reportDir = path.join(__dirname, '..', 'reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const reportFilePath = path.join(reportDir, `invoices_report_${new Date().toISOString()}.csv`);

    const invoices = await this.sql`
      SELECT i.*, p.name AS patient_name, p.age, p.address, p.phone
      FROM invoices i
      JOIN patients p ON i.patient_id = p.id
      ORDER BY i.created_at DESC
    `;

    const columns = ['id', 'patient_name', 'age', 'address', 'phone', 'discount', 'amount_paid', 'remarks', 'created_at'];
    const data = invoices.map(invoice => columns.map(column => invoice[column]));

    const writableStream = fs.createWriteStream(reportFilePath);
    const stringifier = stringify({ header: true, columns });
    stringifier.pipe(writableStream);

    for (const row of data) {
      stringifier.write(row);
    }

    stringifier.end();
    return reportFilePath;
  }
}