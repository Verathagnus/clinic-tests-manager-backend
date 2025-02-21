// src/item-group/item-group.controller.ts
import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { ItemGroupService } from './item-group.service';

@Controller('item-groups')
export class ItemGroupController {
  constructor(private readonly itemGroupService: ItemGroupService) {}

  @Post()
  async create(@Body() createItemGroupDto: { name: string }) {
    return this.itemGroupService.createItemGroup(createItemGroupDto.name);
  }

  @Get()
  async findAll() {
    return this.itemGroupService.getItemGroups();
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateItemGroupDto: { name: string }) {
    return this.itemGroupService.updateItemGroup(id, updateItemGroupDto.name);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.itemGroupService.deleteItemGroup(id);
  }
}