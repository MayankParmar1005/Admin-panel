import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SalonService {

  private http = inject(HttpClient);

  // private apiUrl = 'http://localhost:3000/api/service';  // local environment
  private apiUrl = 'https://employeebackend-production.up.railway.app/api/service'; // live environment

  createService(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  getServices() {
    return this.http.get(this.apiUrl);
  }

  getServiceById(id: string) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateService(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteService(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
