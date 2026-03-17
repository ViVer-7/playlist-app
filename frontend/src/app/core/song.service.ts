import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { Song } from "../models/song.model";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class SongService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiBaseUrl;

  getSongs(name?: string): Promise<Song[]> {
    const params = name ? `?name=${name}` : '';
    return firstValueFrom(this.http.get<Song[]>(`${this.apiUrl}/songs${params}`));
  }

  getSaved(name?: string): Promise<Song[]> {
    const params = name ? `?name=${name}` : '';
    return firstValueFrom(this.http.get<Song[]>(`${this.apiUrl}/saved${params}`));
  }

  addSaved(song: Song): Promise<unknown> {
    return firstValueFrom(this.http.post(`${this.apiUrl}/saved`, song));
  }

  removeSaved(songId: string): Promise<unknown> {
    return firstValueFrom(this.http.delete(`${this.apiUrl}/saved?songId=${songId}`));
  }
}
