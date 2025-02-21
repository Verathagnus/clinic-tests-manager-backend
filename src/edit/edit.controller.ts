// src/edit/edit.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { EditService } from './edit.service';

@Controller('edits')
export class EditController {
  constructor(private readonly editService: EditService) {}

  @Get(':entity/:id')
  async getEdits(@Param('entity') entity: string, @Param('id') id: number) {
    return this.editService.getEdits(entity, id);
  }
}