import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class ConfigsService {
  readonly server_api:string = 'https://localhost:7274';
  constructor() { }
}
