import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UtilsService } from '../services/utils.service';

export const homeGuard: CanActivateFn = (route, state) => {
  const utils = inject(UtilsService);
    const user = utils.getFromLocalStorage('user');
    const cooperative = utils.getFromLocalStorage('cooperative');
  
    if (user && cooperative) {
      return true; // Permitir el acceso
    } else {
      utils.routerLink("/auth")
      return false;
    }
};
