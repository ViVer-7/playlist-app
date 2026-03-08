export interface Song {
  id: number;
  name: string;
  year: number;
  artist: string;
  shortname: string;
  bpm: number;
  duration: number;
  genre: string;
  spotifyId: string;
  album: string;
  albumImage: string;
}

export interface SongDb {
  songs: Song[];
  saved: Song[];
}
