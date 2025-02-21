// src/item/item.service.ts
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import postgres from 'postgres';

@Injectable()
export class ItemService {
  constructor(@Inject('DATABASE_CONNECTION') private sql: postgres.Sql<any>) {}

  async createItem(name: string, groupId: number, description: string, price: number) {
    // Check if the item group exists and is not deleted
    const [group] = await this.sql`
      SELECT * FROM item_groups WHERE id = ${groupId} AND deleted_at IS NULL
    `;

    if (!group) {
      throw new BadRequestException('Invalid item group ID or the group is deleted.');
    }

    // Proceed to create the item
    const [item] = await this.sql`
      INSERT INTO items (name, group_id, description, price)
      VALUES (${name}, ${groupId}, ${description}, ${price})
      RETURNING *
    `;
    return item;
  }

  async getItems() {
    const items = await this.sql`SELECT * FROM items WHERE deleted_at IS NULL`;
    if (!items || items.length === 0){
      return [];
    }
    return items;
  }

  async updateItem(id: number, name: string, groupId: number, description: string, price: number) {
    // Check if the item group exists and is not deleted
    const [group] = await this.sql`
      SELECT * FROM item_groups WHERE id = ${groupId} AND deleted_at IS NULL
    `;

    if (!group) {
      throw new BadRequestException('Invalid item group ID or the group is deleted.');
    }

    const [before] = await this.sql`SELECT * FROM items WHERE id = ${id} AND deleted_at IS NULL`;
    const [item] = await this.sql`
      UPDATE items
      SET name = ${name}, group_id = ${groupId}, description = ${description}, price = ${price}
      WHERE id = ${id} AND deleted_at IS NULL
      RETURNING *
    `;
    await this.sql`
      INSERT INTO edits (entity_name, entity_id, before, after)
      VALUES ('items', ${id}, ${this.sql.json(before)}, ${this.sql.json(item)})
    `;
    return item;
  }

  async deleteItem(id: number) {
    const [before] = await this.sql`SELECT * FROM items WHERE id = ${id} AND deleted_at IS NULL`;
    await this.sql`
      UPDATE items
      SET deleted_at = NOW()
      WHERE id = ${id} AND deleted_at IS NULL
    `;
    await this.sql`
      INSERT INTO edits (entity_name, entity_id, before, after)
      VALUES ('items', ${id}, ${this.sql.json(before)}, ${this.sql.json({ deleted_at: new Date() })})
    `;
  }
}