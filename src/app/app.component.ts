import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthenService } from 'src/app/Middleware/Services/authen.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend_qcsampling';
  login : boolean=false;;

  showHead!: boolean;
  Link!: string;
  showFiller: boolean = false;
  constructor(public router: Router, private servieAuthen: AuthenService, private cookie: CookieService) { }
  isOpened: boolean = true;
 
}
