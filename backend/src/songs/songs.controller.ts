import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Body,
  HttpCode,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { Song } from './song.model';
import { DelayInterceptor } from '../delay.interceptor';
import { rethrowOrWrapAsInternalError } from '../common/exceptions';

@Controller()
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get('songs')
  @UseInterceptors(DelayInterceptor)
  getSongs(@Query() query: Record<string, string>): Song[] {
    try {
      return this.songsService.getSongs('songs', query);
    } catch (error: unknown) {
      rethrowOrWrapAsInternalError(error);
    }
  }

  @Get('saved')
  getSaved(@Query() query: Record<string, string>): Song[] {
    try {
      return this.songsService.getSongs('saved', query);
    } catch (error: unknown) {
      rethrowOrWrapAsInternalError(error);
    }
  }

  @Post('saved')
  @HttpCode(200)
  addSaved(@Body() song: Song | null): { message: string } {
    if (!song) throw new BadRequestException('no song provided');
    try {
      this.songsService.addSavedSong(song);
      return { message: 'song saved' };
    } catch (error: unknown) {
      rethrowOrWrapAsInternalError(error);
    }
  }

  @Delete('saved')
  @HttpCode(200)
  removeSaved(@Query('songId') songId: string): { message: string } {
    if (!songId) throw new BadRequestException('no songId provided');
    try {
      this.songsService.removeSavedSong(songId);
      return { message: 'song removed' };
    } catch (error: unknown) {
      rethrowOrWrapAsInternalError(error);
    }
  }
}
