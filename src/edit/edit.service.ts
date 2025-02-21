// src/edit/edit.service.ts
import { Injectable, Inject } from '@nestjs/common';
import postgres from 'postgres';

@Injectable()
export class EditService {
  constructor(@Inject('DATABASE_CONNECTION') private sql: postgres.Sql<any>) {}

  async getEdits(entity: string, id: number) {
    const edits = await this.sql`
      SELECT * FROM edits
      WHERE entity_name = ${entity} AND entity_id = ${id}
      ORDER BY created_at DESC
    `;
    return edits;
  }

  async logEdit(entity: string, entityId: number, before: any, after: any) {
    await this.sql`
      INSERT INTO edits (entity_name, entity_id, before, after)
      VALUES (${entity}, ${entityId}, ${this.sql.json(before)}, ${this.sql.json(after)})
    `;
  }
}