import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { DelayInterceptor } from './delay.interceptor';

describe('DelayInterceptor', () => {
  let interceptor: DelayInterceptor;
  const handler: CallHandler = { handle: jest.fn(() => of('data')) };

  beforeEach(() => {
    interceptor = new DelayInterceptor();
  });

  it('passes through immediately without the delay flag', (done) => {
    const argv = process.argv;
    process.argv = ['node', 'main.js'];

    interceptor.intercept({} as ExecutionContext, handler).subscribe((val) => {
      expect(val).toBe('data');
      process.argv = argv;
      done();
    });
  });

  it('waits ~1250ms when the delay flag is present', (done) => {
    const argv = process.argv;
    process.argv = ['node', 'main.js', 'delay'];

    const t0 = Date.now();
    interceptor.intercept({} as ExecutionContext, handler).subscribe((val) => {
      expect(val).toBe('data');
      expect(Date.now() - t0).toBeGreaterThanOrEqual(1000);
      process.argv = argv;
      done();
    });
  }, 5000);
});
