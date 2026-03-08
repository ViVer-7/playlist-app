import { SongsService } from './songs.service';
import { DbService } from './db.service';
import { Song, SongDb } from './song.model';

const queen: Song = {
  id: 1,
  name: 'Bohemian Rhapsody',
  year: 1975,
  artist: 'Queen',
  shortname: 'bohemian',
  bpm: 72,
  duration: 354,
  genre: 'Rock',
  spotifyId: '4u7EnebtmKWzUH433cf5Qv',
  album: 'A Night at the Opera',
  albumImage: 'https://i.scdn.co/image/opera.jpg',
};

const weeknd: Song = {
  id: 2,
  name: 'Blinding Lights',
  year: 2020,
  artist: 'The Weeknd',
  shortname: 'blinding',
  bpm: 171,
  duration: 200,
  genre: 'Pop',
  spotifyId: '0VjIjW4GlUZAMYd2vXMi3b',
  album: 'After Hours',
  albumImage: 'https://i.scdn.co/image/afterhours.jpg',
};

const eminem: Song = {
  id: 3,
  name: 'Lose Yourself',
  year: 2002,
  artist: 'Eminem',
  shortname: 'lose',
  bpm: 87,
  duration: 326,
  genre: 'Hip-Hop',
  spotifyId: '5Z01UMMf7V1o0MzF86s6WJ',
  album: '8 Mile',
  albumImage: 'https://i.scdn.co/image/8mile.jpg',
};

describe('SongsService', () => {
  let service: SongsService;
  let dbService: jest.Mocked<DbService>;

  beforeEach(() => {
    const db: SongDb = {
      songs: [queen, weeknd, eminem],
      saved: [queen],
    };

    dbService = {
      getDb: jest.fn(() => JSON.parse(JSON.stringify(db))),
      writeToDb: jest.fn(),
    } as unknown as jest.Mocked<DbService>;

    service = new SongsService(dbService);
  });

  describe('getSongs', () => {
    it('returns everything without filters', () => {
      expect(service.getSongs('songs', {})).toHaveLength(3);
      expect(service.getSongs('saved', {})).toHaveLength(1);
    });

    it('filters by name, case-insensitive', () => {
      const result = service.getSongs('songs', { name: 'bohemian' });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Bohemian Rhapsody');
    });

    it('filters by artist', () => {
      const result = service.getSongs('songs', { artist: 'weeknd' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    it('filters by genre', () => {
      const result = service.getSongs('songs', { genre: 'rock' });
      expect(result).toEqual([expect.objectContaining({ artist: 'Queen' })]);
    });

    it('filters by album', () => {
      const result = service.getSongs('songs', { album: '8 mile' });
      expect(result[0].artist).toBe('Eminem');
    });

    it('matches on ANY provided search key', () => {
      const result = service.getSongs('songs', { name: 'bohemian', artist: 'eminem' });
      expect(result).toHaveLength(2);
    });

    it('ignores keys that are not in the search whitelist', () => {
      const result = service.getSongs('songs', { bpm: '120', year: '2020' });
      expect(result).toHaveLength(3); // no filtering applied
    });

    it('supports partial matches', () => {
      const result = service.getSongs('songs', { name: 'blind' });
      expect(result).toHaveLength(1);
    });

    it('returns nothing for unmatched queries', () => {
      expect(service.getSongs('songs', { name: 'xyz' })).toHaveLength(0);
    });
  });

  describe('addSavedSong', () => {
    it('appends to saved and persists', () => {
      service.addSavedSong(weeknd);

      const written = dbService.writeToDb.mock.calls[0][0];
      expect(written.saved).toHaveLength(2);
      expect(written.saved[1].id).toBe(2);
    });
  });

  describe('removeSavedSong', () => {
    it('removes by id and persists', () => {
      service.removeSavedSong('1');

      const written = dbService.writeToDb.mock.calls[0][0];
      expect(written.saved).toHaveLength(0);
    });

    it('leaves saved intact when id does not exist', () => {
      service.removeSavedSong('999');

      const written = dbService.writeToDb.mock.calls[0][0];
      expect(written.saved).toHaveLength(1);
    });
  });
});
