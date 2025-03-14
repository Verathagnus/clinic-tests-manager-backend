// src/item/item.controller.ts
import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ItemService } from './item.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('items')
// @UseGuards(AuthGuard('jwt'))
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  async create(@Body() createItemDto: { name: string; groupId: number; description: string; price: number }) {
    return this.itemService.createItem(createItemDto.name, createItemDto.groupId, createItemDto.description, createItemDto.price);
  }

  @Get()
  async findAll() {
    return this.itemService.getItems();
  }

  @Get("filter")
  async findAllFiltered(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
    @Query('groupId') groupId: number | null = null,
    @Query('sortBy') sortBy: string = 'created_at',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC'
  ) {
    return this.itemService.getItemsFiltered(page, limit, search, groupId, sortBy, sortOrder);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateItemDto: { name: string; groupId: number; description: string; price: number }) {
    return this.itemService.updateItem(id, updateItemDto.name, updateItemDto.groupId, updateItemDto.description, updateItemDto.price);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.itemService.deleteItem(id);
  }
}