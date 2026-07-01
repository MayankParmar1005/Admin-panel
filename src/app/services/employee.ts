import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Employee {

  private http = inject(HttpClient);

  // private apiUrl = 'http://localhost:3000/api/employees';  // local environment
  // private apiUrl = 'https://employeebackend-production.up.railway.app/api/employees'; // live environment

  private apiUrl = `${environment.apiUrl}/employees`;


  getEmployees() {
    return this.http.get(this.apiUrl);
  }

  createEmployee(employee: any) {
    return this.http.post(this.apiUrl, employee);
  }

  deleteEmployee(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getEmployeeById(id: string) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateEmployee(id: string, employee: any) {
    return this.http.put(`${this.apiUrl}/${id}`, employee);
  }

}
