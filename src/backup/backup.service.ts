import { Injectable, Inject } from '@nestjs/common';
import postgres from 'postgres';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BackupService {
  constructor(@Inject('DATABASE_CONNECTION') private sql: postgres.Sql<any>) {}

  async createBackup(): Promise<string> {
    const backupDir = path.join(__dirname, '..', 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const backupFilePath = path.join(backupDir, `backup_${new Date().toISOString()}.sql`);

    const tables = ['item_groups', 'items', 'patients', 'invoices', 'invoice_items', 'edits', 'users'];
    let backupData = '';

    for (const table of tables) {
      const data = await this.sql`SELECT * FROM ${this.sql.unsafe(table)}`;
      backupData += `-- Data for table ${table}\n`;
      backupData += `INSERT INTO ${table} VALUES\n`;
      backupData += data.map(row => `(${Object.values(row).map(val => this.sql.unsafe(`'${val}'`)).join(', ')})`).join(',\n');
      backupData += ';\n\n';
    }

    fs.writeFileSync(backupFilePath, backupData);
    return backupFilePath;
  }
}