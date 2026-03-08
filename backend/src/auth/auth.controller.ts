import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { randomUUID } from 'crypto';
import { SessionService } from './session.service';
import { rethrowOrWrapAsInternalError } from '../common/exceptions';

@Controller()
export class AuthController {
  constructor(private readonly sessionService: SessionService) {}

  @Get('session')
  session(): { authenticated: boolean } {
    return { authenticated: true };
  }

  @Post('login')
  login(
    @Body() body: { email?: string; password?: string },
    @Res() res: Response,
  ): void {
    try {
      const { email, password } = body;

      if (!email || !password) {
        throw new BadRequestException('Credentials are missing');
      }

      const validEmail = process.env['AUTH_EMAIL'];
      const validPassword = process.env['AUTH_PASSWORD'];

      if (email === validEmail && password === validPassword) {
        const authToken = randomUUID();
        this.sessionService.add(authToken);

        res.cookie('authToken', authToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
          })
          .send({ message: 'ok' });
        return;
      }

      throw new UnauthorizedException('Email or password incorrect');
    } catch (error: unknown) {
      rethrowOrWrapAsInternalError(error);
    }
  }
}
