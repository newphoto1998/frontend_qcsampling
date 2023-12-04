import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SrvQcsamplingService } from 'src/app/Middleware/Services/srv-qcsampling.service';
import { MachineInfo,Wcno } from 'src/app/Models/QCsamplingInfo/qcsampling/machineInfo';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-machine-dashboard',
  templateUrl: './machine-dashboard.component.html',
  styleUrls: ['./machine-dashboard.component.css']
})
export class MachineDashboardComponent {
  displayedColumns = [
    'WCNO',
    'PROCESS',
    'MACHINE',

  ];

  dataSource = new MatTableDataSource<MachineInfo>();

  textSearch!: string;
  selected:string = "ALL";
  wcno !:Wcno[]
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  constructor(private http: HttpClient, private srvSampling: SrvQcsamplingService,private route:Router) { }

  ngOnInit(): void {
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;

    this.getWCNO();
    this.getMachineList();

  }


  // pageLength = 100;
  // pageSize = 10;

  clearData!:MachineInfo[];
  //display!: string;
  getMachineList() {
    this.dataSource.data = this.clearData;
    this.srvSampling.machineList('').subscribe((res:any) => {
      console.log(res)
      //this.dataSource.data = res;
      this.dataSource = new MatTableDataSource<MachineInfo>(res);
      if (Object.keys(res).length) {
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  
  // CoreCompetencyDet(core_code:string){
  //   this.route.navigate([`/core/det/${core_code}`]);
  // }




  getWCNO(){
    this.srvSampling.getWCNO().subscribe(((res:any)=>{ this.wcno = res; }));
  }


  filterValues: any = {
    WCNO: '',

  }
  onChanegeSelect(event: any) {

    if(event.value=="ALL"){
      this.dataSource.filter = '';

    }else{
      //this.dataSource.filter = event.value.split('|')[1];
      this.filterValues.WCNO = event.value;
      this.dataSource.filter = JSON.stringify(this.filterValues);


      this.dataSource.filterPredicate = function (colInfo, filter) {
        //return record.CoreLevel.toLocaleLowerCase() == filter.toLocaleLowerCase();
          let objFilter = JSON.parse(filter);
          let resResult = colInfo.wcno.toLocaleLowerCase() == objFilter.WCNO.toLocaleLowerCase() ;

          return resResult;
      }
    }




  }

}
