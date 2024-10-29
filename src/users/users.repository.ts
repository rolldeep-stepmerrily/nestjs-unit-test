import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CustomHttpException, GLOBAL_ERRORS } from 'src/common/exceptions';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findUsers() {
    try {
      return await this.prismaService.user.findMany({
        where: { deletedAt: null },
        select: { id: true, email: true },
      });
    } catch (e) {
      console.error(e);

      throw new CustomHttpException(GLOBAL_ERRORS.UNKNOWN_ERROR);
    }
  }

  async findUserById(userId: number) {
    try {
      return await this.prismaService.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, deletedAt: true },
      });
    } catch (e) {
      console.error(e);

      throw new CustomHttpException(GLOBAL_ERRORS.UNKNOWN_ERROR);
    }
  }

  async findUserByEmail(email: string) {
    try {
      return await this.prismaService.user.findUnique({
        where: { email },
        select: { id: true, email: true, deletedAt: true },
      });
    } catch (e) {
      console.error(e);

      throw new CustomHttpException(GLOBAL_ERRORS.UNKNOWN_ERROR);
    }
  }

  async createUser(email: string, password: string) {
    try {
      return await this.prismaService.user.create({
        data: { email, password },
        select: { id: true, email: true },
      });
    } catch (e) {
      console.error(e);

      throw new CustomHttpException(GLOBAL_ERRORS.UNKNOWN_ERROR);
    }
  }
}
