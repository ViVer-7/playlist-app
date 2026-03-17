import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../core/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = signal("");
  password = signal("");
  errorMessage = signal("");
  private readonly emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  isFormValid = computed(() => this.emailPattern.test(this.email()) && !!this.password());

  async sendData() {
    this.errorMessage.set("");
    try {
      const response = await this.authService.login(this.email(), this.password());

      if (response) {
        this.router.navigate(["/home"]);
      }
    } catch {
      this.errorMessage.set("Login failed. Please check your credentials.");
    }
  }
}
