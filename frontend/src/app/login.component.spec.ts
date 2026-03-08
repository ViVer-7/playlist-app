import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from './auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: { login: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authService = { login: vi.fn() };
    router = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should navigate to /home on successful login', async () => {
    component.email.set('test@example.com');
    component.password.set('secret');
    authService.login.mockResolvedValue({ token: 'abc' });

    await component.sendData();

    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'secret');
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should set errorMessage on login failure', async () => {
    component.email.set('test@example.com');
    component.password.set('wrong');
    authService.login.mockRejectedValue(new Error('fail'));

    await component.sendData();

    expect(component.errorMessage()).toBe('Login failed. Please check your credentials.');
  });

  it('should clear previous errorMessage before retrying', async () => {
    component.errorMessage.set('Previous error');
    authService.login.mockResolvedValue({ token: 'abc' });

    const promise = component.sendData();
    expect(component.errorMessage()).toBe('');

    await promise;
  });

  it('should not navigate when response is falsy', async () => {
    authService.login.mockResolvedValue(null);

    await component.sendData();

    expect(router.navigate).not.toHaveBeenCalled();
  });
});
