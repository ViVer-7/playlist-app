import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiBaseUrl;

  login(email: string, password: string): Promise<unknown> {
    return firstValueFrom(
      this.http.post(`${this.apiUrl}/login`, { email, password })
    );
  }

  async checkSession(): Promise<boolean> {
    try {
      await firstValueFrom(this.http.get(`${this.apiUrl}/session`));
      return true;
    } catch {
      return false;
    }
  }
}
