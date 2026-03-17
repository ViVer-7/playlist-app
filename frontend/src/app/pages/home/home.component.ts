import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from "@angular/core";
import { Song } from "../../models/song.model";
import { SongDetailComponent } from "../../components/song-detail/song-detail.component";
import { SongCardComponent } from "../../components/song-card/song-card.component";
import { SongService } from "../../core/song.service";

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
  savedIds = computed(() => new Set(this.saved().map((s) => s.id)));
  savingIds = signal(new Set<string>());
  deletingIds = signal(new Set<string>());
  selectedSong = signal<Song | null>(null);
  loading = signal(true);
  error = signal("");

  ngOnInit() {
    this.loadAll();
  }

  async loadAll() {
    try {
      const [savedResponse, songsResponse] = await Promise.all([
        this.songService.getSaved(),
        this.songService.getSongs(),
      ]);
      this.saved.set(savedResponse);
      this.songs.set(songsResponse);
      this.error.set("");
    } catch {
      this.error.set("Failed to load songs. Please try again.");
    } finally {
      this.loading.set(false);
    }
  }

  async saveSong(song: Song) {
    if (this.savingIds().has(song.id)) {
      return;
    }

    this.savingIds.update((ids) => new Set(ids).add(song.id));
    
    try {
      await this.songService.addSaved(song);
      await this.loadAll();
    } catch {
      this.error.set("Failed to save song. Please try again.");
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
    } catch {
      this.error.set("Failed to delete song. Please try again.");
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
