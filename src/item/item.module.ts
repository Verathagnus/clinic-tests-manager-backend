// src/item/item.module.ts
import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ItemService],
  controllers: [ItemController],
})
export class ItemModule {}