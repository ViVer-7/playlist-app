import { routes } from './app.routes';
import { LoginComponent } from './login.component';
import { HomeComponent } from './home.component';
import { authGuard } from './auth.guard';

describe('App Routes', () => {
  it('should map empty path to LoginComponent', () => {
    const route = routes.find(r => r.path === '');
    expect(route?.component).toBe(LoginComponent);
  });

  it('should map login path to LoginComponent', () => {
    const route = routes.find(r => r.path === 'login');
    expect(route?.component).toBe(LoginComponent);
  });

  it('should map home path to HomeComponent', () => {
    const route = routes.find(r => r.path === 'home');
    expect(route?.component).toBe(HomeComponent);
  });

  it('should protect home route with authGuard', () => {
    const route = routes.find(r => r.path === 'home');
    expect(route?.canActivate).toContain(authGuard);
  });
});
