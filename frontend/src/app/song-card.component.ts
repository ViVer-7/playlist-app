import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { Song } from "./song.model";

@Component({
  selector: "app-song-card",
  templateUrl: "./song-card.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "p-2 rounded-lg border-2 border-gray-500 hover:border-orange-400 hover:cursor-pointer transition-colors block",
    "(click)": "selected.emit()",
  },
})
export class SongCardComponent {
  readonly song = input.required<Song>();
  readonly selected = output<void>();
}
