import { BadRequestException } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { Song } from './song.model';

describe('SongsController', () => {
  let controller: SongsController;
  let songsService: jest.Mocked<SongsService>;

  const daftPunk: Song = {
    id: 7,
    name: 'Get Lucky',
    year: 2013,
    artist: 'Daft Punk',
    shortname: 'get-lucky',
    bpm: 116,
    duration: 369,
    genre: 'Disco',
    spotifyId: '2Foc5Q5nqNiosCNqttzHof',
    album: 'Random Access Memories',
    albumImage: 'https://i.scdn.co/image/ram.jpg',
  };

  beforeEach(() => {
    songsService = {
      getSongs: jest.fn().mockReturnValue([daftPunk]),
      addSavedSong: jest.fn(),
      removeSavedSong: jest.fn(),
    } as unknown as jest.Mocked<SongsService>;

    controller = new SongsController(songsService);
  });

  describe('GET /songs', () => {
    it('delegates to the service with row "songs"', () => {
      controller.getSongs({ name: 'lucky' });
      expect(songsService.getSongs).toHaveBeenCalledWith('songs', { name: 'lucky' });
    });

    it('returns whatever the service gives back', () => {
      expect(controller.getSongs({})).toEqual([daftPunk]);
    });
  });

  describe('GET /saved', () => {
    it('delegates to the service with row "saved"', () => {
      controller.getSaved({ artist: 'daft' });
      expect(songsService.getSongs).toHaveBeenCalledWith('saved', { artist: 'daft' });
    });
  });

  describe('POST /saved', () => {
    it('saves the song and confirms', () => {
      const result = controller.addSaved(daftPunk);
      expect(songsService.addSavedSong).toHaveBeenCalledWith(daftPunk);
      expect(result).toEqual({ message: 'song saved' });
    });

    it('throws on null body', () => {
      expect(() => controller.addSaved(null)).toThrow(BadRequestException);
    });
  });

  describe('DELETE /saved', () => {
    it('removes the song and confirms', () => {
      const result = controller.removeSaved('7');
      expect(songsService.removeSavedSong).toHaveBeenCalledWith('7');
      expect(result).toEqual({ message: 'song removed' });
    });

    it('throws without a songId', () => {
      expect(() => controller.removeSaved('')).toThrow(BadRequestException);
      expect(() => controller.removeSaved(undefined as any)).toThrow(BadRequestException);
    });
  });

  it('wraps unexpected service errors', () => {
    songsService.getSongs.mockImplementation(() => {
      throw new Error('disk full');
    });
    expect(() => controller.getSongs({})).toThrow();
  });
});
