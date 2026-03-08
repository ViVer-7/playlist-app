import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    service = new SessionService();
  });

  it('returns false for unknown tokens', () => {
    expect(service.has('abc')).toBe(false);
  });

  it('recognizes a previously added token', () => {
    service.add('my-token');
    expect(service.has('my-token')).toBe(true);
  });

  it('tracks multiple tokens separately', () => {
    service.add('first');
    service.add('second');

    expect(service.has('first')).toBe(true);
    expect(service.has('second')).toBe(true);
    expect(service.has('third')).toBe(false);
  });
});
