import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ConfigsService } from '../configs.service';
import { map, Observable } from 'rxjs';
import { BarcodeDataInfoModule } from 'src/app/Models/QCsamplingInfo/qcsampling/barcodeDataInfo';
import { QcsamplingDataTable } from 'src/app/Models/QCsamplingInfo/qcsampling/qcsamplingDataTable';
import { QcsamplingDataTableHold } from 'src/app/Models/QCsamplingInfo/qcsampling/qcsamplingDataTableHold';

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



getSamplingDataTable(payload:any){
  // return this.http
  // .post<any>(`${this.config.server_api}/api/QCSampling/getSamplingDataTables`,payload, {
  //   observe: 'response',
  //   responseType: 'json',
  //   headers: this.headers,
  // })
  // .pipe(
  //   map((res: any) => {


  //     if (res) {
  //       return res.body;
  //     } else {
  //       return;
  //     }
  //   })
  // );
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



  saveQCsamplingData(payload:any,date_format:string,codename:string){
  
    return this.http.post(this.config.server_api + `/api/QCSampling/SaveQCsamplingData/${date_format}/${codename}`, payload);

 }


 
 saveQCHoldScrapData(payload:any){
  
  return this.http.post(this.config.server_api + `/api/QCSampling/SaveHoldScrapData`, payload);

}
}


