import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserLoginInfo } from 'src/app/Models/QCsamplingInfo/qcsampling/userInfo';
import { ConfigsService } from '../configs.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenService {

  constructor(    
    private cookies: CookieService,
    private router: Router,
    private http: HttpClient,
    private config:ConfigsService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean  {
      console.log('Login : '+this.isLogin());
      console.log('Router URL : '+this.router.url);
      return this.isLogin();
    }


  isLogin():boolean {
    return this.cookies.get('user_info') ? true : false;
  }
  Login(code: any) : Observable<boolean> {
      const body = { code: '',name: code.user,fullname:''};
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.http
        .post<boolean>(`${this.config.server_api}/api/QCSampling/login`, body, {
          responseType: 'json',
          observe: 'response',
          headers: headers,
        })
        .pipe(
          map((response: any) => {
           
            if (response.ok) {
                this.cookies.set('user_info', JSON.stringify(response.body[0]), 2);   /// session expired 2 day
                return response.body[0];
            } else {
                return false;
            }
          })
        );
    
  }

  DeleteUser(){
    try {
      this.cookies.deleteAll();
      return true;
    } catch (err) {
      return false;
    }
  }

  getUserInfo():UserLoginInfo{


    return JSON.parse(this.cookies.get('user_info') || '') as UserLoginInfo;


  }


  
}
