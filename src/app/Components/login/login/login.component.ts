import {

  Component,

  OnInit,

} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormGroupName,
  FormControl,

} from '@angular/forms';
import { HttpClient } from '@angular/common/http';


import { ActivatedRoute, Router } from '@angular/router';
// import { ServiceToastService } from 'src/app/middleware/services/service-toast.service';
import { AuthenService } from 'src/app/Middleware/Services/authen.service'
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
// import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!:FormGroup;
  constructor(
    private http: HttpClient,
    private authService: AuthenService,
    private router: ActivatedRoute,
    private route: Router,
    //private cookies:CookieService,
    private fb:FormBuilder
  ) {}

  
  QueryLink!: string;
  Link!: string;

  sevice: any;
  disabled = true;
  toast: boolean = false;
  hide = true;

  ngOnInit(): void {
   
    this.loginForm = this.fb.group({
      user:['',Validators.required],
    })
    if (!this.authService.isLogin()) {
      
    
      this.router.queryParams.subscribe((data: any) => {
        if (data) {
          this.QueryLink = data.LinkDire;
        }
      });
      
    } else {
      
    }

  }
  
  EventEnter(event:any){

    if(event.key == 'Enter'){
        this.ClickSubmit();
    }

    

  }

  Clear(Form:string){
    this.loginForm.controls[Form].reset();
  }

  ClickSubmit(){
    if (this.loginForm.invalid) {

      Swal.fire("Fail","กรุณากรอกให้ครบ!!","warning");


    } else {
      this.authService.Login(this.loginForm.value).subscribe({
        next:(res)=>{
          console.log(res)
          if (res) {
    
            this.route.navigate([
                  this.QueryLink == undefined ? 'home' : this.QueryLink,
                ])
               
               //this.route.navigate(['home']);

            //Swal.fire("OK","เข้าสู่ระบบสำเร็จ","success");

            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'เข้าสู่ระบบสำเร็จ',
              showConfirmButton: false,
              timer: 800
            }).then(()=>{
              window.location.reload();
            });

          }
         
        },error:(err)=>{
          console.log(err)
          Swal.fire("FAIL","คุณไม่มีสิทธิ์เข้าระบบ ต้องเป็นหน่วยงาน QC เท่านั้น","warning");

        }
      }

      );

    }
  }
  
}
