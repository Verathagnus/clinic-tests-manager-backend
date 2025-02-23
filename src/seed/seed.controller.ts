// src/seed/seed.controller.ts
import { Controller, Get, Post } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  async seed() {
    await this.seedService.seed();
    return { message: 'Database seeded successfully' };
  }
}