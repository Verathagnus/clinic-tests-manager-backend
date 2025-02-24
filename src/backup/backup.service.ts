import { Injectable, Inject } from '@nestjs/common';
import postgres from 'postgres';
import { Readable } from 'stream';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

@Injectable()
export class BackupService {
  constructor(@Inject('DATABASE_CONNECTION') private sql: postgres.Sql<any>) { }

  /**
   * Creates a backup of the database using `pg_dump`.
   * @returns A readable stream of the backup file.
   */
  async createBackupStream(): Promise<Readable> {
    const username = process.env.DB_USER || 'postgres';
    const password = process.env.DB_PASS || 'postgres';
    const database = process.env.DB_NAME || 'clinic_db';
    const date = new Date();
    const currentDate = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}.${date.getHours()}.${date.getMinutes()}`;
    const fileName = `database-backup-${currentDate}.sql`;
    const filePath = path.join(__dirname, '..', 'backups', fileName);

    try {
      // Ensure the backups directory exists
      if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
      }

      // Run pg_dump command
      await execAsync(`pg_dump -Fc --dbname=postgresql://${username}:${password}@127.0.0.1:5432 -f ${filePath}`);

      // Create a readable stream from the backup file
      const stream = fs.createReadStream(filePath);

      // Delete the file after the stream ends
      stream.on('end', () => {
        fs.unlinkSync(filePath);
      });

      return stream;
    } catch (error) {
      console.error('Error creating backup:', error);
      throw new Error('Failed to create backup');
    }
  }

  /**
   * Restores the database from a backup file using `pg_restore`.
   * @param backupFile - The path to the backup file.
   */
  async restoreBackup(backupFile: Express.Multer.File): Promise<void> {
    const username = process.env.DB_USER || 'postgres';
    const password = process.env.DB_PASS || 'postgres';
    const database = process.env.DB_NAME || 'clinic_db';
    const date = new Date();
    const currentDate = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}.${date.getHours()}.${date.getMinutes()}`;
    const preRestoreBackupFileName = `pre-restore-backup-${currentDate}.sql`;
    const preRestoreBackupFilePath = path.join(__dirname, '..', 'backups', preRestoreBackupFileName);
    const restoreFilePath = path.join(__dirname, '..', 'backups', backupFile.originalname);

    try {
      // Ensure the backups directory exists
      if (!fs.existsSync(path.dirname(preRestoreBackupFilePath))) {
        fs.mkdirSync(path.dirname(preRestoreBackupFilePath), { recursive: true });
      }

      // Create a backup of the current database state
      await execAsync(`pg_dump -Fc --dbname=postgresql://${username}:${password}@127.0.0.1:5432 -f ${preRestoreBackupFilePath}`);
      console.log('Pre-restore backup created successfully!');

      // Save the uploaded file to the backups directory
      if (!fs.existsSync(path.dirname(restoreFilePath))) {
        fs.mkdirSync(path.dirname(restoreFilePath), { recursive: true });
      }
      fs.writeFileSync(restoreFilePath, backupFile.buffer);

      // Run pg_restore command
      await execAsync(`pg_restore --clean --if-exists -Fc -c  --dbname=postgresql://${username}:${password}@127.0.0.1:5432 ${restoreFilePath}`);

      // Delete the restore file after restoration
      fs.unlinkSync(restoreFilePath);

      console.log('Database restored successfully!');
    } catch (error) {
      console.error('Error restoring database:', error);
      throw new Error('Failed to restore database');
    }
  }
}