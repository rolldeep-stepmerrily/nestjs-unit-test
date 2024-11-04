import { Injectable } from '@nestjs/common';

import bcrypt from 'bcrypt';

import { CustomHttpException } from '@@exceptions';

import { CreateUserDto } from './users.dto';
import { USER_ERRORS } from './users.exception';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findUsers() {
    const users = await this.usersRepository.findUsers();

    return { users };
  }

  async findUserById(userId: number) {
    const user = await this.usersRepository.findUserById(userId);

    if (!user) {
      throw new CustomHttpException(USER_ERRORS.USER_NOT_FOUND);
    }

    return user;
  }

  async createUser({ email, password }: CreateUserDto) {
    const userExists = await this.usersRepository.findUserByEmail(email);

    if (userExists) {
      throw new CustomHttpException(USER_ERRORS.ALREADY_EXIST_EMAIL);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.usersRepository.createUser(email, hashedPassword);
  }
}
