import { Wcno } from './../../Models/QCsamplingInfo/qcsampling/machineInfo';
// import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild ,AfterViewInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, MinValidator, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common'
import { SrvQcsamplingService } from 'src/app/Middleware/Services/srv-qcsampling.service';
import { BarcodeDataInfoModule } from 'src/app/Models/QCsamplingInfo/qcsampling/barcodeDataInfo';
import { QcsamplingDataTable } from 'src/app/Models/QCsamplingInfo/qcsampling/qcsamplingDataTable';
import { DataTableLineProcessModule, DataTableSubLineProcessModule, LineProcessInfoModule,MainProcessInfoModule,SubProcessInfoModule,Machine} from 'src/app/Models/QCsamplingInfo/qcsampling/lineprocessinfo'
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
std !:string
collapsed = true;
rateInput !:number
SpinnerStatus = false
payload !:any
dataSource: QcsamplingDataTable[] = [];
list_mainpc: MainProcessInfoModule[] = [];
list_subpc: SubProcessInfoModule[] = [];
list_machine : Machine[] = [];
frmQCsampling!: FormGroup;
frmLinepc !:FormGroup
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
total_stock !:number;
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
RunningNumber = ""
main_line = ""
checkInvaild = true
checkLineProcess = false
rows : DataTableLineProcessModule[] = []
sub_rows : DataTableSubLineProcessModule[] = []
isClose = false

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

    this.frmLinepc = this.formBulid.group({
      main_line : ['',Validators.required],
      sub_line : ['',Validators.required],
      machine : [''],
      act : ['',Validators.required],
      nbr:[''],
      std:['']
 
    });
    this.frmLinepc.valueChanges.subscribe(data=>{
      if(this.frmLinepc.controls['main_line'].value &&  this.frmLinepc.controls['sub_line'].value && this.frmLinepc.controls['act'].value
        && this.frmLinepc.controls['std'].value){
          this.checkInvaild = false;
      }else{
        this.checkInvaild = true
      }
    })

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
        }else{
          this.subMit = true
        }
        

      }
    })

    this.getCheckIsCloseDatepicker(this._date.format('yyyy') + this._date.format('MM'))


}

getCheckIsCloseDatepicker(ym:string){
  
  this.SrvQcsamplingService.getStatusCheckDataPicker(ym).subscribe((res:any) => {
   
    this.isClose = res
    console.log(this.isClose + '' + ym)
  })

}

onSelectMainline(event:any){
  //this.main_line = ""
  this.payload ={
    partno:this.partno,
    main_process:event.value
  }
  this.SrvQcsamplingService.getSubine(this.payload).subscribe((res:any) => {
    if(res)
    {
      this.list_subpc = res
    }
  
  })

  this.payload ={
    wcno:this.wcno,
    partno:this.partno,
    main_process:event.value
   
  }
  
  this.SrvQcsamplingService.getMachine(this.payload).subscribe((res:any) => {
    
    if(res)
    {
      this.list_machine = res
 
      this.frmLinepc.controls['machine'].setValue(this.list_machine[0]) 
   
    }


    
  
  })
  this.frmLinepc.controls['std'].setValue('') 
  // this.frmLinepc.controls['machine'].setValue(this.wcno) 
    this.frmLinepc.controls['sub_line'].setValue(this.list_subpc[0]) 
  
}


onSelectSubline(event:any,main:string){
  
  if(main == null){
    this.main_line = this.list_mainpc[0]['main_process']
  }else{
    this.main_line = main
  }
  
  
  this.payload ={
    partno:this.partno,
    main_process:this.main_line,
    sub_process :event.value
  }
  this.SrvQcsamplingService.getStdINSubine(this.payload).subscribe((res:any) => {
   
      this.std = res.result 
      this.frmLinepc.controls['std'].setValue(this.std) 

    
  
  })
}

keyPress_QTY(event:any): boolean {    
  let patt = /^[1-9]*?[0-9]*$/;
  let result = patt.test(event.key);
  return result;
}


keyPress_ACT(event:any): boolean {    
  let patt = /^[0-9]*\.?[0-9]*$/;
  let result = patt.test(event.key);
  return result;
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

  this.loaddataTable(payload)
}

addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
  this._date = moment(event.value);
  this.date_format = this._date.format('yyyy') + '-' + this._date.format('MM') + '-' + this._date.format('DD')

  this.getCheckIsCloseDatepicker(this._date.format('yyyy') + this._date.format('MM'))
  // console.log(this.isClose)
  // if(this.isClose){
  //   this.minDate = new Date(2023,2,1)
  //   this.maxDate = new Date(2023,2,5)
  // }else{
  //   const currentYear = new Date().getFullYear();
  //   this.minDate = new Date(currentYear - 20, 0, 1);
  //   this.maxDate = new Date(currentYear + 1, 11, 31);
  // }

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
         

         if(res.length > 0){
      
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


reloadDataLineProcess(){
  
  var payload = {
    nbr:this.frmLinepc.controls['nbr'].value,
    main_line : this.frmLinepc.controls['main_line'].value,
    sub_line :this.frmLinepc.controls['sub_line'].value
  }
  
  this.main_line =this.frmLinepc.controls['main_line'].value
  this.route.queryParams.subscribe((param: any) => {
    this.SrvQcsamplingService.getLineProcessDataTable(payload).subscribe((dt:any) => {
  
      if(dt){
         
         this.rows = dt
         //dt.sub_line

      
        }


  });

});  
}



onSubmit()  {

  if(!this.isClose){
    this.SpinnerStatus = true
    var values = this.frmQCsampling.value

      this.SrvQcsamplingService.saveQCsamplingData(values,this.date_format,this.name).subscribe((res: any) => {
        if (res) {
            this.openDialog(true);
            if(values.ng == true){
              this.checkLineProcess = true
            }
            else{
              this.checkLineProcess = false
            }
            this.frmLinepc.controls['nbr'].setValue(res.nbr)
          //this.RunningNumber = res.nbr

        }
        else{
            this.openDialogWarning()

        }

      })
      this.barcode.nativeElement.focus();
      this.rows = []

      this.loadDataLineProcess()
    }
    else{
      this.openDialogCheckDatepicker()
    }

  }

  loadDataLineProcess(){
    this.SrvQcsamplingService.getMainline(this.partno).subscribe((res:any) =>{
      if(res){
        this.list_mainpc = res
        console.log(res)
        this.frmLinepc.controls['main_line'].setValue(this.list_mainpc[0]['main_process']);
       
       
        this.payload ={
          wcno:this.wcno,
          partno:this.partno,
          main_process:this.list_mainpc[0]['main_process']
        }

        this.SrvQcsamplingService.getMachine(this.payload).subscribe((res:any) => {
          if(res)
          {
            this.list_machine = res    
            this.frmLinepc.controls['machine'].setValue(this.list_machine[0]['machine']) 
          }
        
        })

        this.SrvQcsamplingService.getSubine(this.payload).subscribe((res:any) => {
          if(res)
          {
            this.list_subpc = res
            this.std = this.list_subpc[0]['sub_std']
            this.frmLinepc.controls['std'].setValue(this.list_subpc[0]['sub_std'])
            this.frmLinepc.controls['sub_line'].setValue(this.list_subpc[0]['sub_process']) 
          }
        
        })
       
       
      }
     
    })
  }


  onSubmitLinePC(values: any){
   
      if(this.frmLinepc.valid){
        values.std = values.std.toString()
          this.SrvQcsamplingService.saveQCLineProcess(values).subscribe((res:any) => {
            if(!res.duplicate){
               this.duplicate(false);
            }else{
               this.duplicate(true)
            }
          })

      }
  }


duplicate(status: boolean){
  if (!status) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'บันทึกสำเร็จ',
      showConfirmButton: false,
      timer: 1500
    }).then(()=>this.reloadDataLineProcess());
    //this.isHidden = true;
  }
  else{
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'มีข้อมูลซ้ำกัน',
      showConfirmButton: false,
      timer: 1500
    })
    //this.isHidden = false;
  }
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


openDialogCheckDatepicker() {
  Swal.fire({
    position: 'center',
    icon: 'error',
    title: 'ไม่สามารถบันทึกได้ เนื่องจากวันที่ดังกล่าวมีการปิดบัญชีไปแล้ว',
    showConfirmButton: false,
    timer: 3000
  });
  this.isHidden = true;





}


openDialogNotfound() {

  Swal.fire({
    position: 'center',
    icon: 'error',
    title: 'ไม่พบข้อมูล Drawing นี้ในระบบ',
    showConfirmButton: false,
    timer: 1500
  }).then(()=>this.ClearBarcode());
  this.isHidden = true;





}



getCurrentShif(){
    this.date = new Date();  
    // if(this.isClose){
    //   this.minDate = new Date(this.date.getFullYear(),this.date.getMonth(),1)
    //   this.maxDate = new Date(this.date.getFullYear(),this.date.getMonth(),this.date.getDate())
    // }else{
    //   const currentYear = new Date().getFullYear();
    //   this.minDate = new Date(currentYear - 20, 0, 1);
    //   this.maxDate = new Date(currentYear + 1, 11, 31);
    // }
  
    if(this.date.getHours() >= 8 && this.date.getHours() <= 20){
      this.selected = this.shift = "D"
      }else{
        

        this.selected = this.shift = "N"

      }
}

 
ClearBarcode(){
  this.datapack = []
  this.rows = []
  //this.frmLinepc.reset();
  this.frmBarcode.reset();
  this.dataSource = this.dataSource.filter(elem => elem.judgementResult === 'AA');
  this.frmQCsampling.reset();
  this.frmQCsampling.controls['_pddate'].setValue(this.date_format)
  this.frmQCsampling.controls['_shift'].setValue("D")  
  this.wcno = ""
  this.std = ""
  this.frmLinepc.reset()
  //this.shift = ""
  //this.date_format =""
  //this.main_line = ""
  this.partno =""
  this.cm =""
  this.model =""
  this.ischeck2 = false;
  this.checkLineProcess = false
  this.isHidden = true;

  this.total_stock = 0
  this.total_samling = 0
 
  
  this.barcode.nativeElement.focus();

 
}


Clear(){

    this.openDialog(false)


 
}


DeleteLine(nbr:string,process:string,point:string){

  let payload ={
    nbr:nbr,
    main_line:process,
    sub_line :point
  }

  Swal.fire({
    title: 'ยืนยันการลบข้อมูล?',
    text: "คุณต้องการลบข้อมูล ใช่หรือไม่!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'ยืนยัน',
    cancelButtonText: 'ยกเลิก'
  }).then((result) => {
    if (result.isConfirmed) {

      this.SrvQcsamplingService.deleteQCLineProcess(payload).subscribe((result:any)=>
      {          
        if(result.status){
          Swal.fire("Successful","ลบข้อมูลสำเร็จ","success").then((()=>this.reloadDataLineProcess()));
        }
      });
    }
  });
}
}
//   //this.router.navigate(['/', 'course']);






