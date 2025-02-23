import { Controller, Get } from '@nestjs/common';
import { BackupService } from './backup.service';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Get('create')
  async createBackup() {
    const backupFilePath = await this.backupService.createBackup();
    return { message: 'Backup created successfully', filePath: backupFilePath };
  }
}