// src/patient/patient.module.ts
import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [PatientService],
  controllers: [PatientController],
})
export class PatientModule {}