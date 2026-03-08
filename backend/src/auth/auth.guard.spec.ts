import { UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { SessionService } from './session.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let sessionService: SessionService;

  beforeEach(() => {
    sessionService = new SessionService();
    guard = new AuthGuard(sessionService);
  });

  function mockCtx(path: string, cookies: Record<string, string> = {}): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ path, cookies }),
      }),
    } as unknown as ExecutionContext;
  }

  it('lets /login through without auth', () => {
    expect(guard.canActivate(mockCtx('/login'))).toBe(true);
  });

  it('blocks requests without a cookie', () => {
    expect(() => guard.canActivate(mockCtx('/songs'))).toThrow(UnauthorizedException);
  });

  it('blocks requests with a bogus token', () => {
    expect(() => guard.canActivate(mockCtx('/songs', { authToken: 'nope' }))).toThrow(
      UnauthorizedException,
    );
  });

  it('allows requests with a valid session token', () => {
    sessionService.add('abc-123');
    expect(guard.canActivate(mockCtx('/saved', { authToken: 'abc-123' }))).toBe(true);
  });

  it('blocks when cookies are missing entirely', () => {
    const ctx = {
      switchToHttp: () => ({
        getRequest: () => ({ path: '/songs', cookies: undefined }),
      }),
    } as unknown as ExecutionContext;

    expect(() => guard.canActivate(ctx)).toThrow(UnauthorizedException);
  });
});
