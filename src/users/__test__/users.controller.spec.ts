import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { CustomHttpException } from 'src/common/exceptions';
import { USER_ERRORS } from '../users.exception';
import { CreateUserDto } from '../users.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    findUsers: jest.fn(),
    findUserById: jest.fn(),
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findUsers', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        { id: 1, email: 'user1@example.com' },
        { id: 2, email: 'user2@example.com' },
      ];

      jest.spyOn(service, 'findUsers').mockResolvedValue({ users: mockUsers });

      const result = await controller.findUsers();

      expect(result).toEqual({ users: mockUsers });
      expect(service.findUsers).toHaveBeenCalled();
    });
  });

  describe('findUserById', () => {
    it('should throw an error if user not exist', async () => {
      const nonExistentUserId = 0;

      jest.spyOn(service, 'findUserById').mockRejectedValue(new CustomHttpException(USER_ERRORS.USER_NOT_FOUND));

      await expect(controller.findUserById(nonExistentUserId)).rejects.toThrow(
        new CustomHttpException(USER_ERRORS.USER_NOT_FOUND),
      );

      expect(service.findUserById).toHaveBeenCalledWith(nonExistentUserId);
      expect(service.findUserById).toHaveBeenCalledTimes(1);
    });

    it('should return a user', async () => {
      const mockUser = {
        id: 1,
        email: 'user1@example.com',
        password: 'password1',
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      };

      jest.spyOn(service, 'findUserById').mockResolvedValue(mockUser);

      const result = await controller.findUserById(1);

      expect(result).toEqual(mockUser);
      expect(service.findUserById).toHaveBeenCalledTimes(1);
    });
  });

  describe('createUser', () => {
    it('should throw an error if email already exists', async () => {
      const createUserDto: CreateUserDto = { email: 'user1@example.com', password: 'password1' };

      jest.spyOn(service, 'createUser').mockRejectedValue(new CustomHttpException(USER_ERRORS.ALREADY_EXIST_EMAIL));

      await expect(controller.createUser(createUserDto)).rejects.toThrow(
        new CustomHttpException(USER_ERRORS.ALREADY_EXIST_EMAIL),
      );

      expect(service.createUser).toHaveBeenCalledWith(createUserDto);
      expect(service.createUser).toHaveBeenCalledTimes(1);
    });

    it('should successfully create a user', async () => {
      const createUserDto: CreateUserDto = { email: 'user1@example.com', password: 'password1' };
      const mockCreatedUser = {
        id: 1,
        email: createUserDto.email,
      };

      jest.spyOn(service, 'createUser').mockResolvedValue(mockCreatedUser);

      const result = await controller.createUser(createUserDto);

      expect(result).toEqual(mockCreatedUser);
      expect(service.createUser).toHaveBeenCalledWith(createUserDto);
      expect(service.createUser).toHaveBeenCalledTimes(1);
    });
  });
});
