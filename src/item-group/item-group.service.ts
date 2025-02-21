// src/item-group/item-group.service.ts
import { Injectable, Inject } from '@nestjs/common';
import postgres from 'postgres';

@Injectable()
export class ItemGroupService {
  constructor(@Inject('DATABASE_CONNECTION') private sql: postgres.Sql<any>) {}

  async createItemGroup(name: string) {
    const [group] = await this.sql`
      INSERT INTO item_groups (name)
      VALUES (${name})
      RETURNING *
    `;
    return group;
  }

  async getItemGroups() {
    return this.sql`SELECT * FROM item_groups WHERE deleted_at IS NULL`;
  }

  async updateItemGroup(id: number, name: string) {
    const [before] = await this.sql`SELECT * FROM item_groups WHERE id = ${id} AND deleted_at IS NULL`;
    const [group] = await this.sql`
      UPDATE item_groups
      SET name = ${name}
      WHERE id = ${id} AND deleted_at IS NULL
      RETURNING *
    `;
    await this.sql`
      INSERT INTO edits (entity_name, entity_id, before, after)
      VALUES ('item_groups', ${id}, ${this.sql.json(before)}, ${this.sql.json(group)})
    `;
    return group;
  }

  async deleteItemGroup(id: number) {
    const [before] = await this.sql`SELECT * FROM item_groups WHERE id = ${id} AND deleted_at IS NULL`;
    await this.sql`
      UPDATE item_groups
      SET deleted_at = NOW()
      WHERE id = ${id} AND deleted_at IS NULL
    `;
    await this.sql`
      INSERT INTO edits (entity_name, entity_id, before, after)
      VALUES ('item_groups', ${id}, ${this.sql.json(before)}, ${this.sql.json({ deleted_at: new Date() })})
    `;
    return {"status": "successfully deleted"}
  }
}