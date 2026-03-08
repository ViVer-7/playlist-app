import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { SessionService } from './session.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    if (request.path === '/login') return true;

    const authToken = request.cookies?.['authToken'] as string | undefined;

    if (authToken && this.sessionService.has(authToken)) {
      return true;
    }

    throw new UnauthorizedException('You are not authenticated');
  }
}
