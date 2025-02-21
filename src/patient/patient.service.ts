// src/patient/patient.service.ts
import { Injectable, Inject } from '@nestjs/common';
import postgres from 'postgres';

@Injectable()
export class PatientService {
  constructor(@Inject('DATABASE_CONNECTION') private sql: postgres.Sql<any>) {}

  async createPatient(name: string, age: number, address: string, phone: string) {
    const [patient] = await this.sql`
      INSERT INTO patients (name, age, address, phone)
      VALUES (${name}, ${age}, ${address}, ${phone})
      RETURNING *
    `;
    return patient;
  }

  async getPatients() {
    return this.sql`SELECT * FROM patients WHERE deleted_at IS NULL`;
  }

  async updatePatient(id: number, name: string, age: number, address: string, phone: string) {
    const [before] = await this.sql`SELECT * FROM patients WHERE id = ${id} AND deleted_at IS NULL`;
    const [patient] = await this.sql`
      UPDATE patients
      SET name = ${name}, age = ${age}, address = ${address}, phone = ${phone}
      WHERE id = ${id} AND deleted_at IS NULL
      RETURNING *
    `;
    await this.sql`
      INSERT INTO edits (entity_name, entity_id, before, after)
      VALUES ('patients', ${id}, ${this.sql.json(before)}, ${this.sql.json(patient)})
    `;
    return patient;
  }

  async deletePatient(id: number) {
    const [before] = await this.sql`SELECT * FROM patients WHERE id = ${id} AND deleted_at IS NULL`;
    await this.sql`
      UPDATE patients
      SET deleted_at = NOW()
      WHERE id = ${id} AND deleted_at IS NULL
    `;
    await this.sql`
      INSERT INTO edits (entity_name, entity_id, before, after)
      VALUES ('patients', ${id}, ${this.sql.json(before)}, ${this.sql.json({ deleted_at: new Date() })})
    `;
  }
}