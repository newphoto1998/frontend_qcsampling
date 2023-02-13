import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree,Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthenService } from 'src/app/Middleware/Services/authen.service';


import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class AuthenUserGuard implements CanActivate {

  constructor(
    private service: AuthenService, 
    private router: Router

  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const user = this.service.isLogin();

    if (user) {
      return true;
    }
    else{

      

      Swal.fire('Warning!', 'Session หมดอายุ', 'warning').then(()=>{
       
        this.router.navigate(['login'], {queryParams: { LinkDire: state.url }
        
        
      });
      return false;

      });
      return false;


    }
  }

  
  
}
