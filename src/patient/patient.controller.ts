// src/patient/patient.controller.ts
import { Controller, Post, Get, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { PatientService } from './patient.service';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) { }

  @Post()
  async create(@Body() createPatientDto: { name: string; age: number; address: string; phone: string }) {
    return this.patientService.createPatient(createPatientDto.name, createPatientDto.age, createPatientDto.address, createPatientDto.phone);
  }

  // src/patient/patient.controller.ts
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
    @Query('sortBy') sortBy: string = 'created_at',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC'
  ) {
    return this.patientService.getPatients(page, limit, search, sortBy, sortOrder);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updatePatientDto: { name: string; age: number; address: string; phone: string }) {
    return this.patientService.updatePatient(id, updatePatientDto.name, updatePatientDto.age, updatePatientDto.address, updatePatientDto.phone);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.patientService.deletePatient(id);
  }
}