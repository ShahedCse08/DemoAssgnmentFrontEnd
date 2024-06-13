import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, RoutesRecognized, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private router: Router, private authService: AuthenticationService) {}

  loggedIn : boolean = this.authService.loggedIn ;

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      debugger;
    if(!this.loggedIn){
      this.router.navigate(['/authentication/login-3']);
      return false;
    }else{
      return true;
    }
  }
  
}
