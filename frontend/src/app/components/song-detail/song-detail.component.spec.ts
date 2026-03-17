import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { SongDetailComponent } from './song-detail.component';
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

describe('SongDetailComponent', () => {
  let component: SongDetailComponent;
  let fixture: ComponentFixture<SongDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SongDetailComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('song', mockSong());
    fixture.detectChanges();
  });

  describe('formatDuration', () => {
    it('should convert milliseconds to M:SS format', () => {
      expect(component.formatDuration(210000)).toBe('3:30');
    });

    it('should pad seconds with leading zero', () => {
      expect(component.formatDuration(120000)).toBe('2:00');
    });

    it('should handle sub-minute durations', () => {
      expect(component.formatDuration(45000)).toBe('0:45');
    });
  });

  describe('getSpotifyUrl', () => {
    it('should return correct Spotify track URL', () => {
      expect(component.getSpotifyUrl('abc123')).toBe('https://open.spotify.com/track/abc123');
    });
  });

  describe('onOverlayClick', () => {
    it('should emit close when target equals currentTarget', () => {
      const closeSpy = vi.fn();
      component.close.subscribe(closeSpy);

      const div = document.createElement('div');
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: div });
      Object.defineProperty(event, 'currentTarget', { value: div });

      component.onOverlayClick(event);
      expect(closeSpy).toHaveBeenCalled();
    });

    it('should NOT emit close when target differs from currentTarget', () => {
      const closeSpy = vi.fn();
      component.close.subscribe(closeSpy);

      const overlay = document.createElement('div');
      const child = document.createElement('span');
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: child });
      Object.defineProperty(event, 'currentTarget', { value: overlay });

      component.onOverlayClick(event);
      expect(closeSpy).not.toHaveBeenCalled();
    });
  });
});
