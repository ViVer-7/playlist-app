import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { DbService } from './db.service';

@Module({
  controllers: [SongsController],
  providers: [SongsService, DbService],
})
export class SongsModule {}
