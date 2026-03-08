import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from "@angular/core";
import { Song } from "./song.model";
import { SongDetailComponent } from "./song-detail.component";
import { SongCardComponent } from "./song-card.component";
import { SongService } from "./song.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  imports: [SongCardComponent, SongDetailComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private readonly songService = inject(SongService);

  songs = signal<Song[]>([]);
  saved = signal<Song[]>([]);
  savedIds = signal(new Set<string>());
  savingIds = signal(new Set<string>());
  deletingIds = signal(new Set<string>());
  selectedSong = signal<Song | null>(null);
  loading = signal(true);

  ngOnInit() {
    this.loadAll();
  }

  async loadAll() {
    const [savedResponse, songsResponse] = await Promise.all([
      this.songService.getSaved(),
      this.songService.getSongs(),
    ]);
    this.saved.set(savedResponse);
    this.songs.set(songsResponse);
    this.savedIds.set(new Set(savedResponse.map((s) => s.id)));
    this.loading.set(false);
  }

  async saveSong(song: Song) {
    if (this.savingIds().has(song.id)) {
      return;
    }

    this.savingIds.update((ids) => new Set(ids).add(song.id));
    
    try {
      await this.songService.addSaved(song);
      await this.loadAll();
    } finally {
      this.savingIds.update((ids) => {
        const next = new Set(ids);
        next.delete(song.id);
        return next;
      });
    }
  }

  async deleteSong(song: Song) {
    if (this.deletingIds().has(song.id)) {
      return;
    }

    this.deletingIds.update((ids) => new Set(ids).add(song.id));
    
    try {
      await this.songService.removeSaved(song.id);
      await this.loadAll();
    } finally {
      this.deletingIds.update((ids) => {
        const next = new Set(ids);
        next.delete(song.id);
        return next;
      });
    }
  }

  async findSongs(target: EventTarget | null) {
    const query = (target as HTMLInputElement).value;
    this.songs.set(await this.songService.getSongs(query));
  }

  async findSongsSaved(target: EventTarget | null) {
    const query = (target as HTMLInputElement).value;
    this.saved.set(await this.songService.getSaved(query));
  }

  selectSong(song: Song) {
    this.selectedSong.set(song);
  }

  closeDetail() {
    this.selectedSong.set(null);
  }
}
