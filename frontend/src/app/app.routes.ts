import { Routes } from '@angular/router';
import { HomeComponent } from "./home.component";
import { LoginComponent } from "./login.component";
import { authGuard } from "./auth.guard";

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
];
