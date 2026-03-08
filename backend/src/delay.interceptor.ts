import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, from, switchMap } from 'rxjs';

const DELAY_MS = 1250;

@Injectable()
export class DelayInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (process.argv.includes('delay')) {
      return from(new Promise((resolve) => setTimeout(resolve, DELAY_MS))).pipe(
        switchMap(() => next.handle()),
      );
    }
    return next.handle();
  }
}
