// src/user/user.service.ts
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import postgres from 'postgres';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@Inject('DATABASE_CONNECTION') private sql: postgres.Sql<any>) {}

  async findOne(username: string): Promise<any> {
    const [user] = await this.sql`
      SELECT * FROM users WHERE username = ${username}
    `;
    return user || null;
  }

  async create(username: string, password: string, isAdmin: boolean = false): Promise<any> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await this.sql`
      INSERT INTO users (username, password, is_admin)
      VALUES (${username}, ${hashedPassword}, ${isAdmin})
      RETURNING id, username, is_admin
    `;
    return user;
  }
}