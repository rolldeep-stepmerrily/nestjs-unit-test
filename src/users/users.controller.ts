import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { ParsePositiveIntPipe } from '@@pipes';

import { CreateUserDto } from './users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findUsers() {
    return await this.usersService.findUsers();
  }

  @Get('/:id')
  async findUserById(@Param('id', ParsePositiveIntPipe) userId: number) {
    return await this.usersService.findUserById(userId);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }
}
