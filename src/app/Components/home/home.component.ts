// import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, retry, startWith } from 'rxjs';
import { DatePipe } from '@angular/common'
import { SrvQcsamplingService } from 'src/app/Middleware/Services/srv-qcsampling.service';
import { BarcodeDataInfoModule } from 'src/app/Models/QCsamplingInfo/qcsampling/barcodeDataInfo';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { QcsamplingDataTable } from 'src/app/Models/QCsamplingInfo/qcsampling/qcsamplingDataTable';
import Swal from 'sweetalert2';
// import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule} from '@angular/material/table'
import { MatTableDataSource} from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  @ViewChild('wcnof')
  wcnof!: ElementRef;
  @ViewChild('barcode')
  barcode!: ElementRef;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  constructor( private formBulid: FormBuilder,
    private SrvQcsamplingService: SrvQcsamplingService, private router: Router ,
    private route:ActivatedRoute,
    public datepipe: DatePipe ) { }

    displayedColumns = [
      'Sampling',
      'Date',
      'QTY',

    ];
payload !:any
dataSource: QcsamplingDataTable[] = [];
//dataSource = new MatTableDataSource<QCsamplingModule>();
frmQCsampling!: FormGroup;
frmBarcode!:FormGroup;
ischeck !: boolean;
ischeck2 !: boolean;
isSimulator = false;

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
labelPosition: 'before' | 'after' = 'after';
date !: Date
latest_date !: string

///form controls for selector


ngOnInit(): void {
    this.date = new Date();  
    
    if(this.date.getHours() >= 8 && this.date.getHours() <= 20){
        this.shift = "D"
      }else{
        this.shift = "N"
      }

      this.latest_date  = this.datepipe.transform(this.date, 'yyyy-MM-dd') || '';


    this.isFocus = !this.isFocus;
    this.frmQCsampling = this.formBulid.group({
      wcno:['',Validators.required],
      partno:['',Validators.required],
      model:['',Validators.required],
      cm: ['',Validators.required],
      desc: ['',Validators.required],
      hold_qty : [0],
      ok: [true],
      ng: [false]
    });

    this.frmBarcode = this.formBulid.group({ barcode:[''] });



}


toggle(status:string) {


  if(status == "OK"){
    this.ischeck = true;
    this.ischeck2 = false;
    this.isHidden = true;
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
        console.log(res)
         if(res){

          this.frmBarcode.setValue({ barcode: '' });


          this.frmQCsampling.setValue({ 
                                        wcno: res[0].wcno, partno: res[0].part_no, 
                                        model: res[0].part_model, cm: res[0].cm, 
                                        desc: res[0].description,
                                        hold_qty : 0, ok: true,ng: false
                                      });
                                   
                                      this.wcno = res[0].wcno
                                      this.partno = res[0].part_no
                                      this.model = res[0].part_model
                                      this.cm = res[0].cm
                                      this.payload = {
      
                                        wcno : this.wcno,
                                        partno : this.partno,
                                        model : this.model,
                                        cm : this.cm,
                                        shift : this.shift,
                                        pddate : this.latest_date,
                                        
                                      }
        
            this.route.queryParams.subscribe((param: any) => {
            this.SrvQcsamplingService.getSamplingDataTable(this.latest_date,this.shift,this.wcno,
            this.partno,this.cm,this.model).subscribe((dt: QcsamplingDataTable[]) => {
              console.log(dt)
                if(res){

                    this.dataSource = dt
                  
                  }


            });
       
        });            
                                                                  
      }


    });
       
  });



    this.wcnof.nativeElement.focus();
}

reloadData(){
  this.route.queryParams.subscribe((param: any) => {
    this.SrvQcsamplingService.getSamplingDataTable(this.latest_date,this.shift,this.wcno,
    this.partno,this.cm,this.model).subscribe((dt: QcsamplingDataTable[]) => {
  
        if(dt){

            this.dataSource = dt
          
          }


    });

});  
}

clear(){
  this.searchValue = null;
}


onSubmit(values: any, formDirective: FormGroupDirective)  {

  if(this.frmQCsampling.valid) {
    this.SrvQcsamplingService.saveQCsamplingData(values,this.latest_date,this.shift).subscribe((res: any) => {
      console.log(res);
      if (res == 'OK') {
        this.openDialog(true);

      }else{
        this.openDialogWarning(false)
      } 

    })
    
  }
  this.barcode.nativeElement.focus();

}


  //this.frmBarcode.setValue({ barcode: '' });
  //this.frmBarcode.reset({ barcode: '' });

  //this.frmQCsampling.reset({wcno:'',partno:'',model:'',cm: '',desc: '',hold_qty :0,ok: false,ng: false});




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
      icon: 'error',
      title: 'ล้างข้อมูลสำเร็จ',
      showConfirmButton: false,
      timer: 1500
    }).then(()=>this.Clear());
    this.isHidden = false;


  }


}


openDialogWarning(status: boolean) {
  if (status) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'บันทึกสำเร็จ',
      showConfirmButton: false,
      timer: 1500
    });
    this.isHidden = true;

  } else {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'บันทึกไม่สำเร็จ',
      showConfirmButton: false,
      timer: 1500
    });
    this.isHidden = false;


  }


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
    console.log(this.dataSource)
 
}

// onClickCancel() {
//   this.frmQCsampling.reset();

//   //this.router.navigate(['/', 'course']);
// }
// openDialog(status: boolean) {
//     if (status) {
//           Swal.fire({
//           position: 'center',
//           icon: 'success',
//           title: 'บันทึกสำเร็จ',
//           showConfirmButton: false,
//           timer: 1500
//       }).then(()=>this.router.navigate(['/', 'course']));
//     } else {
//         Swal.fire({
//         position: 'center',
//         icon: 'error',
//         title: 'บันทึกไม่สำเร็จ',
//         showConfirmButton: false,
//         timer: 1500
//     })
// }

// }
onClickBack(){
  this.router.navigate(['/course'])
}


}


