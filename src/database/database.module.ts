import { Module } from '@nestjs/common';
import postgres from 'postgres';

const sql = postgres({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'clinic_db',
});

@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useValue: sql,
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}