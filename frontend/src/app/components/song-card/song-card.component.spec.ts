import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { SongCardComponent } from './song-card.component';
import { Song } from '../../models/song.model';

function mockSong(overrides: Partial<Song> = {}): Song {
  return {
    id: '1',
    name: 'Test Song',
    artist: 'Test Artist',
    albumImage: 'https://example.com/img.jpg',
    album: 'Test Album',
    year: 2024,
    bpm: 120,
    duration: 210000,
    genre: 'Pop',
    spotifyId: 'abc123',
    ...overrides,
  };
}

describe('SongCardComponent', () => {
  let component: SongCardComponent;
  let fixture: ComponentFixture<SongCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SongCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('song', mockSong({ name: 'My Song', artist: 'My Artist' }));
    fixture.detectChanges();
  });

  it('should render song name and artist', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('My Song');
    expect(el.textContent).toContain('My Artist');
  });

  it('should emit selected on host click', () => {
    const selectedSpy = vi.fn();
    component.selected.subscribe(selectedSpy);

    fixture.nativeElement.click();

    expect(selectedSpy).toHaveBeenCalled();
  });
});
