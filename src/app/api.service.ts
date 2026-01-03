import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/api'; // Replace with your Node.js server URL

  constructor(private http: HttpClient) { }
  pushForm(data:any){
    return this.http.get(`${this.apiUrl}/submit?street=${data.street}&city=${data.city}&state=${data.state}`);
  }
  pushForm2(data:any, data2:any){
    return this.http.get(`${this.apiUrl}/submit2?lat=${data}&lng=${data2}`);
  }
  pushIP(){
    return this.http.get(`${this.apiUrl}/IPInfo`)
  }

  getData() {
    return this.http.get(`${this.apiUrl}/data`);
  }
}