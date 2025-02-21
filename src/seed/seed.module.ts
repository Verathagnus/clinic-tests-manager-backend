import { SeedService } from './seed.service';
// src/seed/seed.module.ts
import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [SeedService],
  controllers: [SeedController],
})
export class SeedModule {}