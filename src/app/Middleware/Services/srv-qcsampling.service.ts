import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ConfigsService } from '../configs.service';
import { map, Observable } from 'rxjs';
import { BarcodeDataInfoModule } from 'src/app/Models/QCsamplingInfo/qcsampling/barcodeDataInfo';
import { QcsamplingDataTable } from 'src/app/Models/QCsamplingInfo/qcsampling/qcsamplingDataTable';
import { QcsamplingDataTableHold } from 'src/app/Models/QCsamplingInfo/qcsampling/qcsamplingDataTableHold';
import { LineProcessInfoModule,MainProcessInfoModule } from 'src/app/Models/QCsamplingInfo/qcsampling/lineprocessinfo';


@Injectable({
  providedIn: 'root'
})
export class SrvQcsamplingService {
  headers = new HttpHeaders().set('content-type', 'application/json');

  constructor(private http: HttpClient, private config: ConfigsService,) { }


  getQrcodeData(payload:any){

    return this.http
    .post<any>(`${this.config.server_api}/api/QCSampling/getDataByQrcode`,payload, {
      observe: 'response',
      responseType: 'json',
      headers: this.headers,
    })
    .pipe(
      map((res: any) => {


        if (res) {
          return res.body;
        } else {
          return;
        }
      })
    );
}


getMainline(partno:string){
  return this.http.get(`${this.config.server_api}/api/QCSampling/getMainLinePC/${partno}`).pipe(
    map((response: any) =>
      response.map((item: MainProcessInfoModule) => item)
    )
  );
}

getMachine(payload:any){
  return this.http.post<any>(`${this.config.server_api}/api/QCSampling/getMachine`,payload);

}

getSubine(payload:any){
  return this.http.post<any>(`${this.config.server_api}/api/QCSampling/getSubLinePC`,payload);

}

getStdINSubine(payload:any){
  return this.http.post<any>(`${this.config.server_api}/api/QCSampling/getStdSubLinePC`,payload);

}




getSamplingDataTable(payload:any){

  return this.http.post<any>(`${this.config.server_api}/api/QCSampling/getSamplingDataTables`,payload);


}


getSamplingDataTableHold(payload:any){
  return this.http
  .post<QcsamplingDataTableHold>(`${this.config.server_api}/api/QCSampling/getSamplingDataTableHold`,payload, {
    responseType: 'json',
    observe: 'response',
    headers: this.headers,
  })
  .pipe(
    map((response: any) => {
      if (response.ok) {
          return response.body;
      } else {
          return false;
      }
    })
  );


}

getLineProcessDataTable(payload:any){
  return this.http.post(this.config.server_api + `/api/QCSampling/getLineProcessDataTable`, payload);


  
}



  saveQCsamplingData(payload:any,date_format:string,codename:string){
  
    return this.http.post(this.config.server_api + `/api/QCSampling/SaveQCsamplingData/${date_format}/${codename}`, payload);

 }


 
 saveQCHoldScrapData(payload:any){
  
  return this.http.post(this.config.server_api + `/api/QCSampling/SaveHoldScrapData`, payload);

}


saveQCLineProcess(payload:any){
  return this.http.post(this.config.server_api + `/api/QCSampling/saveQCLineProcess`, payload);

}

saveProcess(payload:any,code:any){
  return this.http.post(this.config.server_api + `/api/QCSampling/saveProcessMaster/${code}`, payload);

}

saveMachine(payload:any){
  return this.http.post(this.config.server_api + `/api/QCSampling/saveMachine`, payload);

}

getStatusCheckDataPicker(ym:string){
  return this.http.get(this.config.server_api + `/api/QCSampling/statusDatePicker/`+ ym,);

}

getWCNO(){
  return this.http.get(`${this.config.server_api}/api/QCSampling/getWCNO/`).pipe(
    map((response: any) =>
      response.map((item: any) => item)
    )
  );
}




deleteQCLineProcess(payload:any){
  return this.http.post(this.config.server_api + `/api/QCSampling/DeleteQCLineProcess`, payload);

}

ProcessList(payload:any){
  return this.http.post(this.config.server_api + `/api/QCSampling/DataTableProcess`, payload);
}

machineList(payload:any){
  return this.http.post(this.config.server_api + `/api/QCSampling/DataTableMachine`, payload);
}

getProcess(payload:any){
  return this.http.post(this.config.server_api + `/api/QCSampling/getMachineByWCNO`, payload);

}



}


