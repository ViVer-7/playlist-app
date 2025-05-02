import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { Router } from "@angular/router";

@Component({
    selector: "app-home",
    templateUrl: "./login.component.html",
    imports: [CommonModule, FormsModule],
    standalone: true
})
export class LoginComponent {
  email = '';
  password= '';

  constructor(private http: HttpClient, private router: Router){}

  async sendData() {
    const data = { email: this.email, password: this.password };

    const response = await this.http.post("http://localhost:4000/login", data, {
      withCredentials: true,
      headers: {"Content-Type": "application/json"}
    }).toPromise();

    if (response) {
      this.router.navigate(["/home"]);
    }
  }
}
