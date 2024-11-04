import { ApiProperty } from '@nestjs/swagger';

import { User as UserModel } from '@prisma/client';
import { IsEmail, Matches } from 'class-validator';

export class User implements UserModel {
  id: number;

  @ApiProperty({ description: '이메일', example: 'user@example.com', required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '비밀번호', example: 'qwer1234!', required: true })
  @Matches(/^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[!@#$%^&*()]).{8,20}$/)
  password: string;

  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
