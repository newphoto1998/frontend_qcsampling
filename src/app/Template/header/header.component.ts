import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenService } from 'src/app/Middleware/Services/authen.service';
import { Location } from '@angular/common';
// import { NavigationService } from 'src/app/middleware/services/navigation.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output("toggle") navToggle = new EventEmitter();
  @Output("LinkBack") LinkBack:string | any = '';

  constructor(
    private authService: AuthenService,
    private router: Router,
    private cookies:CookieService) { }
  login:boolean = this.authService.isLogin() || false;
  // Usercode:string = this.authService.getUserInfo;
  Name:string = this.authService.isLogin() ? this.authService.getUserInfo().code + ' : '+this.authService.getUserInfo().name : '';
  Usercode:string = this.authService.isLogin() ? this.authService.getUserInfo().code : '';

  ngOnInit(): void {
    console.log(this.authService.getUserInfo().code);


  }

  onClickNavToggle(){
    this.navToggle.emit();
  }
  onClickLogout(){
    this.authService.DeleteUser();
    this.router.navigate(['/login']) 
  }
  // onClickBack(){
  //   this.navigation.back()
  // }
  clickRegister(){
    this.router.navigate(['/Register'])
  }
  loginPage(){
    this.cookies.delete('user_info');
    this.router.navigate(['login']).then(() => {
      window.location.reload();
    });
  }

}


