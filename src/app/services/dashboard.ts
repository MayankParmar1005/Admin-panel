import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Dashboard {

  private http = inject(HttpClient);

  // private apiUrl = 'http://localhost:3000/api/dashboard';  // local environment
  private apiUrl = 'https://employeebackend-production.up.railway.app/api/dashboard'; // live environment


  getStats() {
    return this.http.get(this.apiUrl+"/stats");
  }
  
}
