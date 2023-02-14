// import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild ,AfterViewInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common'
import { SrvQcsamplingService } from 'src/app/Middleware/Services/srv-qcsampling.service';
import { BarcodeDataInfoModule } from 'src/app/Models/QCsamplingInfo/qcsampling/barcodeDataInfo';
import { QcsamplingDataTable } from 'src/app/Models/QCsamplingInfo/qcsampling/qcsamplingDataTable';
import Swal from 'sweetalert2';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { AuthenService } from 'src/app/Middleware/Services/authen.service';
import { UserLoginInfo} from 'src/app/Models/QCsamplingInfo/qcsampling/userInfo'


const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/yyyy',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [

    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})

export class HomeComponent implements OnInit {
  _date = moment().utc();
  date_format !: string;


  @ViewChild('wcnof')
  wcnof!: ElementRef;
  @ViewChild('barcode')
  barcode!: ElementRef;
  @ViewChild('shift') teams!: ElementRef;


  constructor( private formBulid: FormBuilder,
    private elementRef: ElementRef,
    private SrvQcsamplingService: SrvQcsamplingService, private router: Router ,
    private route:ActivatedRoute,
    public datepipe: DatePipe,
    public authService : AuthenService) { }

    displayedColumns = [
      'Sampling',
      'Date',
      'QTY',

    ];
user_info :UserLoginInfo = this.authService.getUserInfo();
code = this.user_info.code
name = this.user_info.name
fullname = this.user_info.fullname

codename = this.user_info.code


payload !:any
dataSource: QcsamplingDataTable[] = [];
frmQCsampling!: FormGroup;
frmBarcode!:FormGroup;
ischeck !: boolean;
ischeck2 !: boolean;
isSimulator = false;
isPicker = true;
isHidden = true;
ymd !: string;
shift !:string;
wcno !:string;
partno !:string;
cm !: string;
model !: string
isSecondFocus :boolean = false;
isFocus :boolean = false;
isChange : boolean = false;
isBlur :boolean = false
searchValue :any = "";
keyboardInput !: string;
date !: Date
aftercheck_status !: boolean;
selected !: string
minDate !: Date
maxDate !: Date



ngOnInit(): void {



    this._date = moment().utc()
    this.date_format = this._date.format('yyyy') + '-' + this._date.format('MM') + '-' + this._date.format('DD')



    this.date = new Date();  
    this.minDate = new Date(this.date.getFullYear(),this.date.getMonth(),1)
    this.maxDate = new Date(this.date.getFullYear(),this.date.getMonth(),this.date.getDate())
    if(this.date.getHours() >= 8 && this.date.getHours() <= 20){
       this.selected = this.shift = "D"
      }else{
        this.selected = this.shift = "N"
      }

    this.isFocus = !this.isFocus;
    this.frmQCsampling = this.formBulid.group({
      _pddate:[moment(),Validators.required],
      _shift:[this.selected,Validators.required],
      wcno:['',Validators.required],
      partno:['',Validators.required],
      model:['',Validators.required],
      cm: [''],
      desc: [''],
      hold_qty : [0],
      ok: [false],
      ng: [false]
    });

    this.frmBarcode = this.formBulid.group({ barcode:[''] });
    //this.barcode.nativeElement.focus()


}



changeClient(vale:string){
  this.shift = vale
}

addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
  this._date = moment(event.value);
  this.date_format = this._date.format('yyyy') + '-' + this._date.format('MM') + '-' + this._date.format('DD')

}

onClickLogout(){
  this.authService.DeleteUser();
  this.router.navigate(['/login']).then(() => {
    window.location.reload();
  });
}

toggle(status:string) {
  


  if(status == "OK"){
    this.ischeck = true;
    this.ischeck2 = false;
    this.isHidden = true;
    this.frmQCsampling.controls['hold_qty'].setValue('0');
  }

  if(status == "NG"){
    this.ischeck = false;
    this.ischeck2 = true;
    this.isHidden = false;
    this.frmQCsampling.controls['hold_qty'].setValue('0');
  }

  

}
onFocusMethod(){
  this.isBlur = true

}

onBlurMethod(){
  this.isBlur = false
}

inputBarcode(data:string){
  this.keyboardInput = data


  //load data in text form
    this.route.queryParams.subscribe((param: any) => {
      this.keyboardInput = data;
      this.SrvQcsamplingService.getQrcodeData(this.keyboardInput).subscribe((res: BarcodeDataInfoModule[]) => {
         if(res){

          this.frmBarcode.setValue({ barcode: '' });


          this.frmQCsampling.setValue({ _pddate:this.date_format, _shift:this.shift,
                                        wcno: res[0].wcno, partno: res[0].part_no, 
                                        model: res[0].part_model, cm: res[0].cm == '' ? '-' : res[0].cm  , 
                                        desc: res[0].description == '' ? '-' : res[0].description,
                                        hold_qty : 0, ok: false,ng: false
                                      });
                                      
                                      
                                      this.wcno = res[0].wcno
                                      this.partno = res[0].part_no
                                      this.model = res[0].part_model
                                      this.cm = res[0].cm                                   
                                      
                                      // var payload = {
                                      //   wcno:this.wcno ,
                                      //   partno:this.partno,
                                      //   cm:this.cm,
                                      //   model:this.model,
                                      //   shift:this.shift,
                                      //   pddate:this.date_format,
                                      //   judgementResult :"",
                                      //   judgementQty :0
                                      // }
                                        
            this.route.queryParams.subscribe((param: any) => {
            this.SrvQcsamplingService.getSamplingDataTable(this.date_format,this.shift,this.wcno,
            this.partno + '_' + this.cm ,this.model).subscribe((dt: QcsamplingDataTable[]) => {
                if(dt){
                    this.dataSource = dt

                  }


            });
       
        });            
                                                                  
      }


    });
       
  });


    //this.wcnof.nativeElement.focus();
}

reloadData(){
  this.route.queryParams.subscribe((param: any) => {
    this.SrvQcsamplingService.getSamplingDataTable(this.date_format,this.shift,this.wcno,
    this.partno + '_' + this.cm,this.model).subscribe((dt: QcsamplingDataTable[]) => {
  
        if(dt){

            this.dataSource = dt
        
          }


    });

});
 this.frmQCsampling.controls['ok'].setValue(false)
 this.frmQCsampling.controls['ng'].setValue(false)
 this.frmQCsampling.controls['hold_qty'].setValue('0');

}

clear(){
  this.searchValue = null;
}


onSubmit(values: any, formDirective: FormGroupDirective)  {
  console.log(values)
  
  if((this.frmQCsampling.valid) && (values.ok || values.ng)) {
    this.SrvQcsamplingService.saveQCsamplingData(values,this.date_format,this.fullname).subscribe((res: any) => {
      if (res == 'OK') {
          this.openDialog(true);
      }

    })
  }
  else{
    this.openDialogWarning()
  }
    

  //this.barcode.nativeElement.focus();

}






openDialog(status: boolean) {
  if (status) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'บันทึกสำเร็จ',
      showConfirmButton: false,
      timer: 1500
    }).then(()=>this.reloadData());
    this.isHidden = true;


  } else {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'ล้างข้อมูลสำเร็จ',
      showConfirmButton: false,
      timer: 1500
    }).then(()=>this.Clear());
    this.isHidden = false;


  }


}


openDialogWarning() {
  // if (status) {
  //   Swal.fire({
  //     position: 'center',
  //     icon: 'success',
  //     title: 'บันทึกสำเร็จ',
  //     showConfirmButton: false,
  //     timer: 1500
  //   });
  //   this.isHidden = true;

  // } else {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'บันทึกไม่สำเร็จ กรุณาตรวจสอบข้อมูลอีกครั้ง',
      showConfirmButton: false,
      timer: 1500
    });
    this.isHidden = true;

  
  


}


// savedata(wcno:string,partno:string,cm:string){
    
//     if(wcno != "" && partno != "" && cm != ""){
     
//       var val = {
//         wcno: wcno,
//         partno: partno,
//         cm: cm,   
//         pddate: new Date().toLocaleTimeString,
//         model: "",
//         shift: "D",
        
//       };
//       console.log(val)
//         this.SrvQcsamplingService.saveQCsamplingData(val).subscribe(res =>{
//           alert(res.toString());
//         })
//     }
// }


 
Clear(){
  //this.openDialog(false)

    this.dataSource = this.dataSource.filter(elem => elem.judgementResult === 'AA');
    this.frmQCsampling.reset();
    //this.barcode.nativeElement.focus();

 
}
//   //this.router.navigate(['/', 'course']);



}


