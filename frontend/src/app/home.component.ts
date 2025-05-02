import {Component, OnInit} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {CommonModule, NgOptimizedImage} from "@angular/common";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    imports: [CommonModule, NgOptimizedImage],
    standalone: true
})


export class HomeComponent implements OnInit {
  songs: Record<any, any>[] = [];
  saved: Record<any, any>[] = [];
  authToken;

  constructor(private http: HttpClient) {
    this.authToken = this.getAuthToken();
  }

  ngOnInit() {
    this.getSongs();
  }

  getAuthToken() {
    let atc = document.cookie.split(";").find((cookie) => cookie.trim().startsWith("authToken"));
    return atc?.split("=")[1] || null;
  }

  async getSongs() {
    const savedResponse = await this.http.get<any>(`http://localhost:4000/saved?authToken=${this.authToken}`).toPromise();
    const songsResponse = await this.http.get<any>(`http://localhost:4000/songs?authToken=${this.authToken}`).toPromise();
    this.saved = savedResponse;
    this.songs = songsResponse;
  }

  async saveSong(song: any) {
    await this.http.post(`http://localhost:4000/saved?authToken=${this.authToken}`, song).toPromise();
  }

  async deleteSong(song: any) {
    await this.http.delete(`http://localhost:4000/saved?authToken=${this.authToken}`, {body: song}).toPromise();
  }

  async findSongs(query: any) {
    const response = await this.http.get<any>(`http://localhost:4000/songs?name=${query.value}&authToken=${this.authToken}`).toPromise();
    this.songs = response;
  }

  async findSongsSaved(query: any) {
    const response = await this.http.get<any>(`http://localhost:4000/saved?name=${query}&authToken=${this.authToken}`).toPromise();
    this.saved = response;

  }
}
