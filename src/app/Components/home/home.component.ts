// import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild ,AfterViewInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, MinValidator, Validators } from '@angular/forms';
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


rateInput !:number
SpinnerStatus = false
payload !:any
dataSource: QcsamplingDataTable[] = [];
frmQCsampling!: FormGroup;
frmBarcode!:FormGroup;
ischeck !: boolean;
ischeck2 !: boolean;
subMit = true
datapack : BarcodeDataInfoModule[] = []
isHidden = true;
ymd !: string;
shift !:string;
wcno !:string;
partno !:string;
cm !: string;
model !: string
total_stock  = 0;
total_samling = 0
remain_sampling = 0
isFocus :boolean = false;
isBlur :boolean = false
searchValue :any = "";
keyboardInput !: string;
date !: Date
selected !: string
minDate !: Date
maxDate !: Date



ngOnInit(): void {



    this._date = moment().utc()
    this.date_format = this._date.format('yyyy') + '-' + this._date.format('MM') + '-' + this._date.format('DD')

    this.getCurrentShif();

    this.isFocus = !this.isFocus;
    this.frmQCsampling = this.formBulid.group({
      _pddate:[moment(),Validators.required],
      _shift:[this.selected,Validators.required],
      wcno:['',Validators.required],
      partno:['',Validators.required],
      model:['',Validators.required],
      cm: [''],
      desc: [''],
      hold_qty : [this.total_stock,Validators.max(Number(this.total_stock))],
      ok: false,
      ng: false
    });

    this.frmBarcode = this.formBulid.group({ barcode:[''] });
    this.frmQCsampling.valueChanges.subscribe(data=>{
      if(data.ok && this.datapack.length){
        this.subMit = false;
      }else{
        if(this.datapack.length > 0){
          this.remain_sampling = this.total_stock - this.total_samling  // ยอดการผลิต - ยอดที่ sampling ไปแล้ว
          if(this.total_samling > 0){
            this.subMit = data.hold_qty > 0 && data.hold_qty <= this.remain_sampling  ? false : true
        

          }else{
            this.subMit = data.hold_qty > 0 && data.hold_qty <= this.total_stock  ? false : true


          }
        }
        

      }
    })

}



changeClient(vale:string){
  this.shift = vale
  if(this.shift == "N"){
    var ndate =  this.date.setDate(this.date.getDate() - 1);
    this.frmQCsampling.controls['_pddate'].setValue(moment(ndate)) 
  }

  var payload = {
    pddate:this.date_format,                                        
    shift:this.shift,
    wcno:this.wcno,
    partno:this.partno,
    cm:this.cm,
    model:this.model,
  

  }

  this.loaddataTable(payload)
}

addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
  this._date = moment(event.value);
  this.date_format = this._date.format('yyyy') + '-' + this._date.format('MM') + '-' + this._date.format('DD')

  var payload = {
    pddate:this.date_format,                                        
    shift:this.shift,
    wcno:this.wcno,
    partno:this.partno,
    cm:this.cm,
    model:this.model,
  

  } 
  this.loaddataTable(payload)

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
    this.frmQCsampling.controls['ng'].setValue(false);
    //this.subMit = this.wcno !== undefined ? false :true
    
  }

  if(status == "NG"){
    this.ischeck = false;
    this.ischeck2 = true;
    this.isHidden = false;
    this.frmQCsampling.controls['hold_qty'].setValue('0');
    this.frmQCsampling.controls['ok'].setValue(false);

    //this.subMit = true
  }

  

}
onFocusMethod(){
  this.isBlur = true

}

onBlurMethod(){
  this.isBlur = false
}

inputBarcode(data:string,pddate:string,shift:string){
  this.keyboardInput = data

  //load data in text form
    this.route.queryParams.subscribe((param: any) => {
      
      var payload = {
        qrcode:data,
        pddate:pddate,
        shift:shift

      }

      this.SrvQcsamplingService.getQrcodeData(payload).subscribe((res: BarcodeDataInfoModule[]) => {
        this.datapack = []
         if(res.length > 0 ){

          this.frmBarcode.setValue({ barcode: '' });

          this.datapack = res
          this.frmQCsampling.setValue({ _pddate:this.date_format, 
                                        _shift:this.shift,
                                        wcno: res[0].wcno, 
                                        partno: res[0].part_no, 
                                        model: res[0].part_model, 
                                        cm: res[0].cm == '' ? '-' : res[0].cm  , 
                                        desc: res[0].description == '' ? '-' : res[0].description,
                                        hold_qty : 0, 
                                        ok: false,ng: false
                                      });
                                      
                                      
                                      this.wcno = res[0].wcno
                                      this.partno = res[0].part_no
                                      this.model = res[0].part_model
                                      this.cm = res[0].cm    
                                      this.total_stock = res[0].total
                                      
                                      var payload = {
                                        pddate:this.date_format,
                                        shift:this.shift,
                                        wcno:this.wcno,
                                        partno:this.partno,
                                        cm:this.cm,
                                        model:this.model,
                                      
                                
                                      }
                                      
                                  this.loaddataTable(payload)
                                        
        
                                                                  
      }else{
        this.openDialogNotfound()
      }


    });
       
  });


    //this.wcnof.nativeElement.focus();
}

loaddataTable(payload:any){
  this.total_samling = 0;
   this.route.queryParams.subscribe((param: any) => {
    this.SrvQcsamplingService.getSamplingDataTable(payload).subscribe({
      next:(res)=>{
        console.log(res)
        this.total_stock = res.totalQty 
        this.dataSource = res.dt
        if(this.dataSource.length > 0){
          this.dataSource.forEach(element => {
            this.total_samling += element.judgementQty
          });
        }else{
          this.total_samling = 0;
        }
      }
    })

});          
}


reloadData(){

  var payload = {
    pddate:this.date_format,
    shift:this.shift,
    wcno:this.wcno,
    partno:this.partno,
    cm:this.cm,
    model:this.model,
  

  }

  this.loaddataTable(payload)
  this.route.queryParams.subscribe((param: any) => {


});
this.barcode.nativeElement.focus();

 this.frmQCsampling.controls['ok'].setValue(false)
 this.frmQCsampling.controls['ng'].setValue(false)
 this.frmQCsampling.controls['hold_qty'].setValue('0');

}



onSubmit()  {
  this.SpinnerStatus = true
  var values = this.frmQCsampling.value

    this.SrvQcsamplingService.saveQCsamplingData(values,this.date_format,this.name).subscribe((res: any) => {
      if (res == 'OK') {
          this.openDialog(true);
      }
      else{
          this.openDialogWarning()

      }

    })
    this.barcode.nativeElement.focus();

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
    }).then(()=>this.ClearBarcode());
    this.isHidden = false;


  }

  this.SpinnerStatus = false
}


openDialogWarning() {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'บันทึกไม่สำเร็จ กรุณาตรวจสอบข้อมูลอีกครั้ง',
      showConfirmButton: false,
      timer: 1500
    });
    this.isHidden = true;

  
  


}


openDialogNotfound() {

  Swal.fire({
    position: 'center',
    icon: 'error',
    title: 'ไม่พบข้อมูล กรุณาตรวจสอบ QRCDOE หรือ วันที่ อีกครั้ง',
    showConfirmButton: false,
    timer: 1500
  }).then(()=>this.ClearBarcode());
  this.isHidden = true;





}



getCurrentShif(){
    this.date = new Date();  
    this.minDate = new Date(this.date.getFullYear(),this.date.getMonth(),1)
    this.maxDate = new Date(this.date.getFullYear(),this.date.getMonth(),this.date.getDate())
    if(this.date.getHours() >= 8 && this.date.getHours() <= 20){
      this.selected = this.shift = "D"
      }else{
        

        this.selected = this.shift = "N"

      }
}

 
ClearBarcode(){
  this.wcno = ""
  this.date_format =""
  this.shift = ""
  this.partno =""
  this.cm =""
  this.model =""
  this.frmBarcode.reset();
  this.ischeck2 = false;
  this.isHidden = true;
  this.dataSource = this.dataSource.filter(elem => elem.judgementResult === 'AA');
  this.total_stock = 0
  this.total_samling = 0
  this.frmQCsampling.reset();
  this.frmQCsampling.controls['_pddate'].setValue(moment())
  this.frmQCsampling.controls['_shift'].setValue(this.selected)
  this.barcode.nativeElement.focus();

 
}


Clear(){

    this.openDialog(false)


 
}
//   //this.router.navigate(['/', 'course']);



}


