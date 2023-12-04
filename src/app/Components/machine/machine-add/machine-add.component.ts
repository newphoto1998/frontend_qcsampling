import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SrvQcsamplingService } from 'src/app/Middleware/Services/srv-qcsampling.service';
import {
  MachineInfo,
  Wcno,
  process
} from 'src/app/Models/QCsamplingInfo/qcsampling/machineInfo';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-machine-add',
  templateUrl: './machine-add.component.html',
  styleUrls: ['./machine-add.component.css'],
})
export class MachineAddComponent {
  constructor(
    private http: HttpClient,
    private formBulid: FormBuilder,
    private srvSampling: SrvQcsamplingService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  wcno !:Wcno[]
  process !:process[]
  coreFrmGroup!: FormGroup;
  states: string[] = [];
  format!: any;
  url!: any;
  dataCoreCode!: any;
  resCoreCode!: any;
  payload !:any
  txtCode: String = '';
  core_code: string = this.route.snapshot.paramMap.get('core_code') || '';
  TitleCore: string = 'หน้าเพิ่ม Machine';
  //end
  txt_videoSelect!: any;
  input_fileName!: any;
  // PositLV!:PositLevelInfo[];
  // oCodeCount !: CoreComInfo[];

  status: string = 'INSERT';

  ngOnInit(): void {
    this.coreFrmGroup = this.formBulid.group({
      wcno: ['', Validators.required],
      machine: ['', Validators.required],
      main_process: ['', Validators.required],
    });
    this.getWCNO();

   
  }

  
  getWCNO(){
    this.srvSampling.getWCNO().subscribe(((res:any)=>{ this.wcno = res; }));
    console.log(this.wcno)
    this.srvSampling.getProcess(this.wcno[0]).subscribe(((res:any)=>{ this.process = res; }));
    this.coreFrmGroup.controls['main_process'].setValue(this.process[0]);

  }

  onSubmit(values: any, formDirective: FormGroupDirective) {
    if (this.coreFrmGroup.valid) {
     

      try {
        this.srvSampling.saveMachine(values).subscribe((res: any) => {
          if (!res.duplicate) {
            this.openDialog(true);
          } else {
            this.openDialog(false);
          }
        });
      } catch {
        this.openDialog(false);
      }
    
  }
}


  onChanegeSelect(event: any) {
 
    //=======================================================
    //=== call service for generate core competency code ====
    //=======================================================
    this.payload ={
      wcno : event.value
    }
    this.srvSampling.getProcess(this.payload).subscribe(((res:any)=>{ this.process = res; console.log(res)}));
    
    //this.coreFrmGroup.controls['process'].setValue(this.process[0]);

  
  }

  onClickCancel() {
    this.coreFrmGroup.reset();

    this.router.navigate(['/', 'machine-dashboard']);
  }
  openDialog(status: boolean) {
    if (status) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'บันทึกสำเร็จ',
        showConfirmButton: false,
        timer: 1500,
      }).then(() => this.router.navigate(['/', 'core']));
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'บันทึกไม่สำเร็จ ข้อมูลซ้ำกัน',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
  // onClickBack() {
  //   this.router.navigate(['/core']);
  // }
}
