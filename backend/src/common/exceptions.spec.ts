import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { rethrowOrWrapAsInternalError } from './exceptions';

describe('rethrowOrWrapAsInternalError', () => {
  it('rethrows NestJS HTTP exceptions unchanged', () => {
    const err = new BadRequestException('nope');
    expect(() => rethrowOrWrapAsInternalError(err)).toThrow(BadRequestException);
  });

  it('wraps plain errors as InternalServerError', () => {
    expect(() => rethrowOrWrapAsInternalError(new Error('oops'))).toThrow(
      InternalServerErrorException,
    );
  });

  it('keeps the original message when wrapping', () => {
    try {
      rethrowOrWrapAsInternalError(new Error('db timeout'));
    } catch (e: any) {
      expect(e.getResponse()).toEqual(expect.objectContaining({ message: 'db timeout' }));
    }
  });

  it('uses "Unknown error" for non-Error values', () => {
    try {
      rethrowOrWrapAsInternalError('something weird');
    } catch (e: any) {
      expect(e).toBeInstanceOf(InternalServerErrorException);
      expect(e.getResponse().message).toBe('Unknown error');
    }
  });
});
