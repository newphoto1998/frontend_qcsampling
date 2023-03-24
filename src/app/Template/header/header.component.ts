import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenService } from 'src/app/Middleware/Services/authen.service';
import { Location } from '@angular/common';
import { MatSidenav } from '@angular/material/sidenav';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output("toggle") navToggle = new EventEmitter();
  @Output("LinkBack") LinkBack:string | any = '';
  @ViewChild('sideNav') sideNav!:MatSidenav ;
  constructor(
    private authService: AuthenService,
    private router: Router,
    private cookies:CookieService) { }

    listMenu : any[] = [
      {name:'home',text:'SAMPLING',routeLink:'/home'},
      {name:'hold',text:'งาน UNHOLD',routeLink:'/hold'}
     
    ]

  login:boolean = this.authService.isLogin() || false;
  // Usercode:string = this.authService.getUserInfo;
  Name:string = this.authService.isLogin() ? this.authService.getUserInfo().code + ' : '+this.authService.getUserInfo().name : '';
  Usercode:string = this.authService.isLogin() ? this.authService.getUserInfo().code : '';
  opened : boolean = false
  title !: string
  ngOnInit(): void {
    this.title = "SAMPLING";
    console.log(this.authService.getUserInfo().code);


  }

  selectedComponent(menudetail:any){
    this.title = menudetail
    this.sideNav.toggle();
  }

  onClickNavToggle(){
    this.navToggle.emit();
  }
  onClickLogout(){
    this.authService.DeleteUser();
    this.router.navigate(['/login']) 
  }
  // onClickBack(){
 
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


