import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { User as UserModel } from '@prisma/client';
import bcrypt from 'bcrypt';

import { UsersService } from '../users.service';
import { UsersRepository } from '../users.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CreateUserDto } from '../users.dto';
import { CustomHttpException } from 'src/common/exceptions';
import { USER_ERRORS } from '../users.exception';

jest.mock('bcrypt');

const mockUsersRepository = {
  findUsers: jest.fn(),
  findUserById: jest.fn(),
  findUserByEmail: jest.fn(),
  createUser: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), PrismaModule],
      providers: [UsersService, { provide: UsersRepository, useValue: mockUsersRepository }],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findUsers', () => {
    it('should return users', async () => {
      const mockUsers: UserModel[] = [
        {
          id: 1,
          email: 'user1@example.com',
          password: 'password1',
          createdAt: new Date(),
          updatedAt: null,
          deletedAt: null,
        },
        {
          id: 2,
          email: 'user2@example.com',
          password: 'password2',
          createdAt: new Date(),
          updatedAt: null,
          deletedAt: null,
        },
      ];
      jest.spyOn(repository, 'findUsers').mockResolvedValue(mockUsers);

      const result = await service.findUsers();

      expect(result).toEqual({ users: mockUsers });
      expect(repository.findUsers).toHaveBeenCalledTimes(1);
    });
  });

  describe('findUserById', () => {
    it('should throw an error if not exist user', async () => {
      const nonExistentUserId = 0;

      jest.spyOn(repository, 'findUserById').mockResolvedValue(null);

      await expect(service.findUserById(nonExistentUserId)).rejects.toThrow(
        new CustomHttpException(USER_ERRORS.USER_NOT_FOUND),
      );

      expect(repository.findUserById).toHaveBeenCalledWith(nonExistentUserId);
      expect(repository.findUserById).toHaveBeenCalledTimes(1);
    });

    it('should return a user', async () => {
      const mockUser: UserModel = {
        id: 1,
        email: 'user1@example.com',
        password: 'password1',
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      };

      jest.spyOn(repository, 'findUserById').mockResolvedValue(mockUser);

      const result = await service.findUserById(1);

      expect(result).toEqual(mockUser);
      expect(repository.findUserById).toHaveBeenCalledTimes(1);
    });
  });

  describe('createUser', () => {
    it('should throw an error if the email already exists', async () => {
      const mockEmail = 'user1@example.com';
      const mockUser: UserModel = {
        id: 1,
        email: mockEmail,
        password: 'password1',
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      };
      const mockDto: CreateUserDto = { email: mockEmail, password: 'password1' };

      jest.spyOn(repository, 'findUserByEmail').mockResolvedValueOnce(mockUser);

      await expect(service.createUser(mockDto)).rejects.toThrow(
        new CustomHttpException(USER_ERRORS.ALREADY_EXIST_EMAIL),
      );

      expect(repository.findUserByEmail).toHaveBeenCalledWith(mockEmail);
      expect(repository.createUser).not.toHaveBeenCalled();
    });

    it('should create a new user', async () => {
      const mockEmail = 'newUser@example.com';
      const mockPassword = 'password1';
      const mockHashedPassword = 'hashedPassword1';

      const mockDto: CreateUserDto = { email: mockEmail, password: mockPassword };
      const mockCreatedUser = {
        id: 1,
        email: mockEmail,
        password: mockHashedPassword,
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);

      jest.spyOn(repository, 'findUserByEmail').mockResolvedValue(null);
      jest.spyOn(repository, 'createUser').mockResolvedValue(mockCreatedUser);

      const result = await service.createUser(mockDto);

      expect(result).toEqual(mockCreatedUser);
      expect(repository.findUserByEmail).toHaveBeenCalledWith(mockEmail);
      expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 10);
      expect(repository.createUser).toHaveBeenCalledWith(mockEmail, mockHashedPassword);
      expect(repository.createUser).toHaveBeenCalledTimes(1);
    });
  });
});
