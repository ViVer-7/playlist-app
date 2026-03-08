import * as fs from 'fs';
import { DbService } from './db.service';
import { SongDb } from './song.model';

jest.mock('fs');

describe('DbService', () => {
  let service: DbService;
  const mockedFs = fs as jest.Mocked<typeof fs>;

  const sampleDb: SongDb = {
    songs: [
      {
        id: 42,
        name: 'Smells Like Teen Spirit',
        year: 1991,
        artist: 'Nirvana',
        shortname: 'teen-spirit',
        bpm: 117,
        duration: 301,
        genre: 'Grunge',
        spotifyId: '5ghIJDpPoe3CfHMGu71E6T',
        album: 'Nevermind',
        albumImage: 'https://i.scdn.co/image/nevermind.jpg',
      },
    ],
    saved: [],
  };

  beforeEach(() => {
    service = new DbService();
    jest.clearAllMocks();
  });

  it('reads and parses db.json', () => {
    mockedFs.readFileSync.mockReturnValue(JSON.stringify(sampleDb));

    const result = service.getDb();

    expect(mockedFs.readFileSync).toHaveBeenCalledWith(expect.stringContaining('db.json'), 'utf-8');
    expect(result).toEqual(sampleDb);
  });

  it('writes stringified data back to db.json', () => {
    service.writeToDb(sampleDb);

    expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('db.json'),
      JSON.stringify(sampleDb),
    );
  });
});
