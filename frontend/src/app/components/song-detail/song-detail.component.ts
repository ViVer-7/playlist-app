import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { Song } from "../../models/song.model";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-song-detail",
  templateUrl: "./song-detail.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongDetailComponent {
  readonly song = input.required<Song>();
  readonly close = output<void>();

  formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  getSpotifyUrl(spotifyId: string): string {
    return `${environment.spotifyBaseUrl}/${spotifyId}`;
  }

  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}
