// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ItemModule } from './item/item.module';
import { InvoiceModule } from './invoice/invoice.module';
import { ItemGroupModule } from './item-group/item-group.module';
import { PatientModule } from './patient/patient.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SeedModule } from './seed/seed.module';
import { BackupReportModule } from './backup/backup.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    ItemModule,
    InvoiceModule,
    ItemGroupModule,
    PatientModule,
    AuthModule,
    UserModule,
    SeedModule,
    BackupReportModule,
    ReportModule,
  ],
})
export class AppModule {}