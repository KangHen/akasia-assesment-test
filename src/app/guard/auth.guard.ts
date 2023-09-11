import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const storageService = new StorageService
  const has = storageService.has('auth')

  if(has) {
    return true;
  }

  return inject(Router).createUrlTree(["/"]);
};
