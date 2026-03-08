import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { SongsModule } from './songs/songs.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [SongsModule, AuthModule],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}
