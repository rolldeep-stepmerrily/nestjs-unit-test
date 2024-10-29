import { HttpStatus } from '@nestjs/common';

export const USER_ERRORS = {
  ALREADY_EXIST_EMAIL: {
    statusCode: HttpStatus.CONFLICT,
    errorCode: 'ALREADY_EXIST_EMAIL',
    message: 'user email already exist',
  },
  USER_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 'USER_NOT_FOUND',
    message: 'user not nound',
  },
};
