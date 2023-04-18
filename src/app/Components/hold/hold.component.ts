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
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { QcsamplingDataTableHold } from 'src/app/Models/QCsamplingInfo/qcsampling/qcsamplingDataTableHold';

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




export interface Row {
  docno: string,
  pddate: string,
  judgementQty: number,
  Sub_table?: Sub[]
}

export interface Sub {
  
  time: string,
  hold_qty: string,
  cby: string,
  
}



@Component({
  selector: 'app-hold',
  templateUrl: './hold.component.html',
  styleUrls: ['./hold.component.css'],
  providers: [

    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],

  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HoldComponent implements OnInit {

  expanded: {[key: string]: boolean} = {};

  rows !: any

  //rows = ROWS
  

  datasourcess !: any

  _date = moment().utc();
  date_format !: string;


  @ViewChild('wcnof')
  wcnof!: ElementRef;
  @ViewChild('barcode')
  barcode!: ElementRef;
  @ViewChild('shift') teams!: ElementRef;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  jq = 0;
  constructor( private formBulid: FormBuilder,
    private elementRef: ElementRef,
    private SrvQcsamplingService: SrvQcsamplingService, private router: Router ,
    private route:ActivatedRoute,
    public datepipe: DatePipe,
    public authService : AuthenService) { }

    displayedColumns = [
      'TIME',
      'RESULT',
      'ACTION'

    ];
 
i = 1;
user_info :UserLoginInfo = this.authService.getUserInfo();
code = this.user_info.code
name = this.user_info.name
fullname = this.user_info.fullname
enableEdit = false;
enableallEdit = false;
enableEditIndex = null;

dataSource = new MatTableDataSource<QcsamplingDataTable>();
docno !:string
total!:string
SpinnerStatus = false
payload !:any
frmQCsampling!: FormGroup;
frmBarcode!:FormGroup;
ischeck !: boolean;
ischeck2 !: boolean;
isHidden = true;
ymd !: string;
shift !:string;
wcno !:string;
partno !:string;
cm !: string;
model !: string
isFocus :boolean = false;
isBlur :boolean = false
searchValue :any = "";
keyboardInput !: string;
date !: Date
selected !: string
minDate !: Date
maxDate !: Date
hold_qty_total = 0;
hold_qty_old !: number
hold_qty_new !: number
isCheckButton = false
disableButton = false
qrcode !: string

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
      

    });

    this.frmBarcode = this.formBulid.group({ barcode:[''] });

}

callFunction(rowIndex:number):boolean{
    
  this.hold_qty_total = 0;
  
    this.hold_qty_old =this.rows[rowIndex].judgementQty //ค่าเก่า
    for(var val in this.rows[rowIndex].sub_table){
      this.hold_qty_total += Number(this.rows[rowIndex].sub_table[val].hold_qty)
   
     }
   
    
    if(this.hold_qty_total  >= this.hold_qty_old ){
      

      return true;
    }else{
    


      return false;
    }
}
  
isRowClickable(rowIndex: number): any  {
  return this.rows[rowIndex].sub_table! && this.rows[rowIndex].sub_table!.length > 0

}


changeClient(vale:string){
  this.shift = vale

  // if(this.shift == "N"){
  //   //console.log(moment(this.date_format,'YYYY-MM-DD').add('-1','days').format('YYYY-MM-DD'))
  //   //this._date =  this.date.setDate(moment(this.date.getDate() - 1));
    
  //   this.date_format = moment(this.date_format,'YYYY-MM-DD').add('-1','days').format('YYYY-MM-DD')
  //   this.frmQCsampling.controls['_pddate'].setValue(this.date_format) 

  // }
  var payload = {
    pddate:this.date_format,                                        
    shift:this.shift,
    wcno:this.wcno,
    partno:this.partno,
    cm:this.cm,
    model:this.model,
  

  } 

  this.loadHoldDatatable(payload)  


 

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

  this.loadHoldDatatable(payload)  

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

keyPress(event:any): boolean {    
  let patt = /^([0-9])$/;
  let result = patt.test(event.key);
  return result;
}

inputBarcode(data:string,pddate:string,shift:string){
  
  this.qrcode = data
  var payload = {
    qrcode:data,
    pddate:pddate,
    shift:shift

  }

    this.route.queryParams.subscribe((param: any) => {
      this.keyboardInput = data;
      this.SrvQcsamplingService.getQrcodeData(payload).subscribe((res: BarcodeDataInfoModule[]) => {
       
         if(res.length >0){

          this.frmBarcode.setValue({ barcode: '' });


          this.frmQCsampling.setValue({ _pddate:this.date_format, _shift:this.shift,
                                        wcno: res[0].wcno, partno: res[0].part_no, 
                                        model: res[0].part_model, cm: res[0].cm == '' ? '-' : res[0].cm  , 
                                        desc: res[0].description == '' ? '-' : res[0].description
                                       

                                      });
                                      
                                    
                                      this.wcno = res[0].wcno
                                      this.partno = res[0].part_no
                                      this.model = res[0].part_model
                                      this.cm = res[0].cm
                                      
                                      var payload = {
                                        pddate:this.date_format,                                        
                                        shift:this.shift,
                                        wcno:this.wcno,
                                        partno:this.partno,
                                        cm:this.cm,
                                        model:this.model,
                                      
                                
                                      }       
                                      
                                        
                                      this.loadHoldDatatable(payload)          
                                                                  
      }else{
        this.openDialogNotfound();
      }


    });
       
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
  this.loadHoldDatatable(payload) 
 
this.barcode.nativeElement.focus();

//  this.frmQCsampling.controls['ok'].setValue(false)
//  this.frmQCsampling.controls['ng'].setValue(false)
//  this.frmQCsampling.controls['hold_qty'].setValue('0');


}

clear(){
  this.searchValue = null;
}


loadHoldDatatable(payload:any){
  this.route.queryParams.subscribe((param: any) => {
    this.SrvQcsamplingService.getSamplingDataTableHold(payload).subscribe((dt: QcsamplingDataTable[]) => {
  
        if(dt){

           this.rows = dt

        
          }


    });
   

  });
  this.enableEdit = false;


}

enableEditMethod(e:any, i:any) {
  this.hold_qty_new = 0;
  this.hold_qty_old = 0;
  this.hold_qty_total = 0;

  this.enableEdit = true;
  this.enableEditIndex = i;

  
  this.hold_qty_old =this.rows[i].judgementQty //ค่าเก่า


  this.hold_qty_total = this.CalHoldQTY(i)


 
  if( this.hold_qty_total  > this.hold_qty_old || this.hold_qty_total == 0){
    
    this.isCheckButton = true
  }else{
    this.isCheckButton = false
  }
  

  console.log(i, e);
}

updateVal(newVal:any,rowIndex:number){
  
  this.hold_qty_new = 0;
  this.hold_qty_old = 0;
  this.hold_qty_total = 0;

  this.hold_qty_old =this.rows[rowIndex].judgementQty //ค่าเก่า
  this.hold_qty_new = newVal.target.value

 

  this.hold_qty_total = this.CalHoldQTY(rowIndex)


 
  if( this.hold_qty_total  > this.hold_qty_old || this.hold_qty_total == 0){
    
    this.isCheckButton = true
  }else{
    this.isCheckButton = false
  }

  


  
}

CalHoldQTY(rowIndex:number){
  if(this.rows[rowIndex].sub_table.length > 0){
    for(var val in this.rows[rowIndex].sub_table){
      this.hold_qty_total += Number(this.rows[rowIndex].sub_table[val].hold_qty)
 
   }
    this.hold_qty_total += Number(this.hold_qty_new)

  }else{
      this.hold_qty_total = this.hold_qty_new;

  }

  return this.hold_qty_total
}

InsertHoldScrap(rowIndex : any,docno:string){


  var payload = {
    docno:docno,
    hold_qty: this.hold_qty_new ,
    emp:this.code,
    pddate:this.date_format
  }

  this.SrvQcsamplingService.saveQCHoldScrapData(payload).subscribe((res: any) => {
    if (res == 'OK') {
        this.openDialog(true);
    }
    else{
      //this.openDialog(false);

    }

  })

 
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

  this.SpinnerStatus = false
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
      timer: 2000
    });
    this.isHidden = true;
}


openDialogNotfound() {

    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'ไม่พบข้อมูล กรุณาตรวจสอบ QRCDOE หรือ เลือกวันที่ อีกครั้ง',
      showConfirmButton: false,
      timer: 1500
    }).then(()=>this.Clear());
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

 
Clear(){
   
    this.frmBarcode.reset();
    //this.frmQCsampling.reset();
    // this.frmQCsampling.controls['_pddate'].setValue(moment())
    // this.frmQCsampling.controls['_shift'].setValue(this.selected)
    this.barcode.nativeElement.focus();

 
}




//   //this.router.navigate(['/', 'course']);



}

