import { User as UserModel } from '@prisma/client';

export class User implements UserModel {
  id: number;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
