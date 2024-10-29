import { HttpStatus } from '@nestjs/common';

export const USER_ERRORS = {
  ALREADY_EXIST_EMAIL: {
    statusCode: HttpStatus.CONFLICT,
    errorCode: 'ALREADY_EXIST_EMAIL',
    message: 'user email already exist',
  },
};
