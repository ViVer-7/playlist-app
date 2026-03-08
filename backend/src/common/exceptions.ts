import { HttpException, InternalServerErrorException } from '@nestjs/common';

export function rethrowOrWrapAsInternalError(error: unknown): never {
  if (error instanceof HttpException) {
    throw error;
  }
  const message = error instanceof Error ? error.message : 'Unknown error';
  throw new InternalServerErrorException(message);
}
