import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { SongDb } from './song.model';

@Injectable()
export class DbService {
  private readonly dbPath = path.join(process.cwd(), 'db.json');

  getDb(): SongDb {
    return JSON.parse(fs.readFileSync(this.dbPath, 'utf-8'));
  }

  writeToDb(data: SongDb): void {
    fs.writeFileSync(this.dbPath, JSON.stringify(data));
  }
}
