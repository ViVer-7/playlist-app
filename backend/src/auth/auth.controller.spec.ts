import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SessionService } from './session.service';

describe('AuthController', () => {
  let controller: AuthController;
  let sessionService: SessionService;

  beforeEach(() => {
    sessionService = new SessionService();
    controller = new AuthController(sessionService);

    process.env['AUTH_EMAIL'] = 'admin@spotify.dev';
    process.env['AUTH_PASSWORD'] = 's3cret';
  });

  afterEach(() => {
    delete process.env['AUTH_EMAIL'];
    delete process.env['AUTH_PASSWORD'];
  });

  describe('GET /session', () => {
    it('returns authenticated: true', () => {
      expect(controller.session()).toEqual({ authenticated: true });
    });
  });

  describe('POST /login', () => {
    const mockRes = () => {
      const res: any = {
        cookie: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };
      return res;
    };

    it('rejects missing email', () => {
      expect(() => controller.login({ password: 's3cret' }, mockRes())).toThrow(
        BadRequestException,
      );
    });

    it('rejects missing password', () => {
      expect(() => controller.login({ email: 'admin@spotify.dev' }, mockRes())).toThrow(
        BadRequestException,
      );
    });

    it('rejects empty body', () => {
      expect(() => controller.login({}, mockRes())).toThrow(BadRequestException);
    });

    it('rejects wrong credentials', () => {
      const res = mockRes();
      expect(() =>
        controller.login({ email: 'admin@spotify.dev', password: 'wrong' }, res),
      ).toThrow(UnauthorizedException);

      expect(() =>
        controller.login({ email: 'nobody@test.com', password: 's3cret' }, res),
      ).toThrow(UnauthorizedException);
    });

    it('sets a cookie and responds on valid login', () => {
      const res = mockRes();
      controller.login({ email: 'admin@spotify.dev', password: 's3cret' }, res);

      expect(res.cookie).toHaveBeenCalledWith('authToken', expect.any(String), {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
      expect(res.send).toHaveBeenCalledWith({ message: 'ok' });
    });

    it('stores the generated token in the session', () => {
      const res = mockRes();
      controller.login({ email: 'admin@spotify.dev', password: 's3cret' }, res);

      const token = res.cookie.mock.calls[0][1];
      expect(sessionService.has(token)).toBe(true);
    });

    it('generates different tokens per login', () => {
      const res1 = mockRes();
      const res2 = mockRes();

      controller.login({ email: 'admin@spotify.dev', password: 's3cret' }, res1);
      controller.login({ email: 'admin@spotify.dev', password: 's3cret' }, res2);

      expect(res1.cookie.mock.calls[0][1]).not.toBe(res2.cookie.mock.calls[0][1]);
    });
  });
});
