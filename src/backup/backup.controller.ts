import { Controller, Post, UploadedFile, UseInterceptors, Get, Res } from '@nestjs/common';
import { BackupService } from './backup.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Get('create')
  async createBackup(@Res() res: Response) {
    const backupStream = await this.backupService.createBackupStream();

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/sql');
    res.setHeader('Content-Disposition', `attachment; filename=backup_${new Date().toISOString()}.sql`);

    // Pipe the backup stream to the response
    backupStream.pipe(res);

    // Handle stream errors
    backupStream.on('error', (err) => {
      console.error('Error streaming backup data:', err);
      res.status(500).send('Failed to generate backup');
    });
  }

  @Post('restore')
  @UseInterceptors(FileInterceptor('file'))
  async restoreBackup(@UploadedFile() file: Express.Multer.File) {
    return this.backupService.restoreBackup(file);
  }
}