// src/user/user.controller.ts
import { Controller, Post, Body, BadRequestException, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('register')
  async register(@Body() createUserDto: { username: string; password: string; isAdmin: boolean }) {
    const existingUser = await this.userService.findOne(createUserDto.username);
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }
    return this.userService.create(createUserDto.username, createUserDto.password, createUserDto.isAdmin);
  }

  @Get()
  async getUserRoute() {
    return this.userService.getUsers();
  }
}