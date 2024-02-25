import { Injectable } from '@angular/core';
import { Router, CanActivate, UrlTree } from '@angular/router';
import { AuthService } from './services/auth.service';



@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }
  async canActivate(route: any, state: any): Promise<boolean | UrlTree> {
    const user = await this.authService.getUser()
    if (user) {
      return true
    } else {
      return this.router.createUrlTree(
        ['/login-page'],
        { queryParams: { returnUrl: state.url } }
      );
    }

  }
}
