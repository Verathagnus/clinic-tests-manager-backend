// src/item-group/item-group.module.ts
import { Module } from '@nestjs/common';
import { ItemGroupService } from './item-group.service';
import { ItemGroupController } from './item-group.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ItemGroupService],
  controllers: [ItemGroupController],
})
export class ItemGroupModule {}