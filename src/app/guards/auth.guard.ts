import { CanActivateFn } from '@angular/router';
import { UtilsService } from '../services/utils.service';
import { inject } from '@angular/core';
import { User } from '../models/user.model';

export const authGuard: CanActivateFn = (route, state) => {
  const utils = inject(UtilsService);
  const user: User = utils.getFromLocalStorage('user');
  const cooperative = utils.getFromLocalStorage('cooperative');

  if (user && cooperative) {
    if(user.rol == "Administrador") utils.routerLink("/home/admin/bus")  
    return false;
  } else {
    return true;
  }
};
