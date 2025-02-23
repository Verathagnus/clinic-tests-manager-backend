// src/patient/patient.service.ts
import { Injectable, Inject } from '@nestjs/common';
import postgres from 'postgres';

@Injectable()
export class PatientService {
  constructor(@Inject('DATABASE_CONNECTION') private sql: postgres.Sql<any>) { }

  async createPatient(name: string, age: number, address: string, phone: string) {
    const [patient] = await this.sql`
      INSERT INTO patients (name, age, address, phone)
      VALUES (${name}, ${age}, ${address}, ${phone})
      RETURNING *
    `;
    return patient;
  }

  // src/patient/patient.service.ts
  // src/patient/patient.service.ts
async getPatients(
  page: number = 1,
  limit: number = 10,
  search: string = '',
  sortBy: string = 'created_at',
  sortOrder: 'ASC' | 'DESC' = 'DESC'
) {
  const offset = (page - 1) * limit;

  // Validate sortBy and sortOrder to prevent SQL injection
  const validSortColumns = ['name', 'age', 'address', 'phone', 'created_at'];
  const validSortOrders = ['ASC', 'DESC'];

  if (!validSortColumns.includes(sortBy)) {
    sortBy = 'created_at'; // Default to 'created_at' if invalid
  }

  if (!validSortOrders.includes(sortOrder)) {
    sortOrder = 'DESC'; // Default to 'DESC' if invalid
  }

  // Manually construct the ORDER BY clause
  const orderByClause = `${sortBy} ${sortOrder}`;

  // Construct the query safely
  const query = this.sql`
    SELECT * FROM patients 
    WHERE deleted_at IS NULL 
    AND (name ILIKE ${`%${search}%`} OR phone ILIKE ${`%${search}%`})
    ORDER BY ${this.sql.unsafe(orderByClause)}
    LIMIT ${limit} OFFSET ${offset}
  `;

  const patients = await query;

  const totalPatients = await this.sql`
    SELECT COUNT(*) FROM patients 
    WHERE deleted_at IS NULL 
    AND (name ILIKE ${`%${search}%`} OR phone ILIKE ${`%${search}%`})
  `;

  return {
    patients,
    totalPatients: totalPatients[0].count,
    totalPages: Math.ceil(totalPatients[0].count / limit),
    currentPage: page,
  };
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