import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ConfigsService } from '../configs.service';
import { map, Observable } from 'rxjs';
import { BarcodeDataInfoModule } from 'src/app/Models/QCsamplingInfo/qcsampling/barcodeDataInfo';
import { QcsamplingDataTable } from 'src/app/Models/QCsamplingInfo/qcsampling/qcsamplingDataTable';

@Injectable({
  providedIn: 'root'
})
export class SrvQcsamplingService {

  constructor(private http: HttpClient, private config: ConfigsService,) { }



  getQrcodeData(qrcode:any){

    return this.http
    .get<BarcodeDataInfoModule[]>(`${this.config.server_api}/api/QCSampling/getDataByQrcode?qrcode=${qrcode}`, {
      responseType: 'json',
      observe: 'response',
    })
    .pipe(
      map((response: any) => {
        if (response.ok) {
          return response.body;
        } else {
          return response;
        }
      })
    );
}



getSamplingDataTable(date:string,shift:string,wcno:string,partno:string,model:string){

  return this.http
  .get<QcsamplingDataTable[]>(`${this.config.server_api}/api/QCSampling/getSamplingDataTable/${date}/${shift}/${wcno}/${partno}/${model}`, {
    responseType: 'json',
    observe: 'response',
  })
  .pipe(
    map((response: any) => {
      if (response.ok) {
        return response.body;
      } else {
        return response;
      }
    })
  );
}



  saveQCsamplingData(payload:any){
  
    return this.http.post(this.config.server_api + `/api/QCSampling/SaveQCsamplingData`, payload);

 }
}


