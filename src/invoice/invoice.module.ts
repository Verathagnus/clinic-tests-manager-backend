// src/invoice/invoice.module.ts
import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [InvoiceService],
  controllers: [InvoiceController],
})
export class InvoiceModule {}