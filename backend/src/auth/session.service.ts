import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionService {
  private readonly sessions = new Set<string>();

  add(token: string): void {
    this.sessions.add(token);
  }

  has(token: string): boolean {
    return this.sessions.has(token);
  }
}
