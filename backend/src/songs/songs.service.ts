import { Injectable } from '@nestjs/common';
import { DbService } from './db.service';
import { Song } from './song.model';

const SEARCH_KEYS = ['name', 'artist', 'genre', 'album'];

@Injectable()
export class SongsService {
  constructor(private readonly db: DbService) {}

  getSongs(row: 'songs' | 'saved', query: Record<string, string>): Song[] {
    const searchQueries = Object.entries(query).filter(([key]) =>
      SEARCH_KEYS.includes(key as (typeof SEARCH_KEYS)[number]),
    );

    const data = this.db.getDb()[row];

    const filtered =
      searchQueries.length > 0
        ? data.filter((song) =>
            searchQueries.some(([key, value]) =>
              (song as unknown as Record<string, unknown>)[key]
                ?.toString()
                .toLowerCase()
                .includes(value?.toLowerCase()),
            ),
          )
        : data;

    return filtered;
  }

  addSavedSong(song: Song): void {
    const data = this.db.getDb();
    data.saved.push(song);
    this.db.writeToDb(data);
  }

  removeSavedSong(songId: string): void {
    const data = this.db.getDb();
    data.saved = data.saved.filter((el) => el.id !== Number(songId));
    this.db.writeToDb(data);
  }
}
