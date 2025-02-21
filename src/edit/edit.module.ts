// src/edit/edit.module.ts
import { Module } from '@nestjs/common';
import { EditService } from './edit.service';
import { EditController } from './edit.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [EditService],
  controllers: [EditController],
  exports: [EditService],
})
export class EditModule {}