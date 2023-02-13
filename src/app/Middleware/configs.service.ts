import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class ConfigsService {
  //readonly server_api:string = 'http://localhost:7274';
  readonly server_api:string = 'http://dciweb2.dci.daikin.co.jp/QCSamplingAPI'
  constructor() { }
}
