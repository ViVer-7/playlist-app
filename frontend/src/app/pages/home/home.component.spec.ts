import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { HomeComponent } from './home.component';
import { SongService } from '../../core/song.service';
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

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let songService: { getSongs: ReturnType<typeof vi.fn>; getSaved: ReturnType<typeof vi.fn>; addSaved: ReturnType<typeof vi.fn>; removeSaved: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    songService = {
      getSongs: vi.fn().mockResolvedValue([]),
      getSaved: vi.fn().mockResolvedValue([]),
      addSaved: vi.fn().mockResolvedValue({}),
      removeSaved: vi.fn().mockResolvedValue({}),
    };

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: SongService, useValue: songService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should load songs and saved on init, populating savedIds', async () => {
    const saved = [mockSong({ id: 's1' })];
    const songs = [mockSong({ id: 's2' })];
    songService.getSaved.mockResolvedValue(saved);
    songService.getSongs.mockResolvedValue(songs);

    await component.loadAll();

    expect(component.saved()).toEqual(saved);
    expect(component.songs()).toEqual(songs);
    expect(component.savedIds().has('s1')).toBe(true);
    expect(component.savedIds().has('s2')).toBe(false);
  });

  it('should call addSaved on saveSong and refresh', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const song = mockSong({ id: 'new1' });
    songService.addSaved.mockResolvedValue({});
    songService.getSaved.mockResolvedValue([song]);
    songService.getSongs.mockResolvedValue([mockSong({ id: '2' })]);

    await component.saveSong(song);

    expect(songService.addSaved).toHaveBeenCalledWith(song);
    expect(component.saved()).toEqual([song]);
    expect(component.savingIds().has('new1')).toBe(false);
  });

  it('should guard against duplicate saves via savingIds', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const song = mockSong({ id: 'dup1' });
    songService.addSaved.mockReturnValue(new Promise(() => {})); // never resolves

    component.saveSong(song);
    expect(component.savingIds().has('dup1')).toBe(true);

    // second call should be a no-op
    component.saveSong(song);
    expect(songService.addSaved).toHaveBeenCalledTimes(1);
  });

  it('should clean up savingIds even on error', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const song = mockSong({ id: 'err1' });
    songService.addSaved.mockRejectedValue(new Error('fail'));

    await component.saveSong(song).catch(() => {});

    expect(component.savingIds().has('err1')).toBe(false);
  });

  it('should call removeSaved on deleteSong and refresh', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const song = mockSong({ id: 'del1' });
    songService.removeSaved.mockResolvedValue({});

    await component.deleteSong(song);

    expect(songService.removeSaved).toHaveBeenCalledWith('del1');
    expect(component.deletingIds().has('del1')).toBe(false);
  });

  it('should guard against duplicate deletes via deletingIds', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const song = mockSong({ id: 'dup2' });
    songService.removeSaved.mockReturnValue(new Promise(() => {}));

    component.deleteSong(song);
    expect(component.deletingIds().has('dup2')).toBe(true);

    component.deleteSong(song);
    expect(songService.removeSaved).toHaveBeenCalledTimes(1);
  });

  it('should search songs via findSongs', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const results = [mockSong({ id: 'q1', name: 'Query Result' })];
    songService.getSongs.mockResolvedValue(results);

    await component.findSongs({ value: 'test' } as unknown as EventTarget);

    expect(songService.getSongs).toHaveBeenCalledWith('test');
    expect(component.songs()).toEqual(results);
  });

  it('should search saved songs via findSongsSaved', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const results = [mockSong({ id: 'q2', name: 'Saved Result' })];
    songService.getSaved.mockResolvedValue(results);

    await component.findSongsSaved({ value: 'hello' } as unknown as EventTarget);

    expect(songService.getSaved).toHaveBeenCalledWith('hello');
    expect(component.saved()).toEqual(results);
  });

  it('should manage selectedSong via selectSong and closeDetail', () => {
    const song = mockSong();
    component.selectSong(song);
    expect(component.selectedSong()).toBe(song);

    component.closeDetail();
    expect(component.selectedSong()).toBeNull();
  });
});
