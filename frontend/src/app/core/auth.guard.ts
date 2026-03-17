import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "./auth.service";

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const authenticated = await authService.checkSession();

  if (authenticated) {
    return true;
  }

  return router.createUrlTree(["/login"]);
};
