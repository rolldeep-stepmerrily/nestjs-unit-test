import { Injectable } from '@nestjs/common';

import { UsersRepository } from './users.repository';
import { CreateUserDto } from './users.dto';
import { CustomHttpException } from 'src/common/exceptions';
import { USER_ERRORS } from './users.exception';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findUsers() {
    const users = await this.usersRepository.findUsers();

    return { users };
  }

  async findUserById(userId: number) {
    return await this.usersRepository.findUserById(userId);
  }

  async createUser({ email, password }: CreateUserDto) {
    const userExists = await this.usersRepository.findUserByEmail(email);

    if (userExists) {
      throw new CustomHttpException(USER_ERRORS.ALREADY_EXIST_EMAIL);
    }

    return await this.usersRepository.createUser(email, password);
  }
}
