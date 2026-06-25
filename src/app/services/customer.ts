import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Customer {

  private http = inject(HttpClient);

  // private apiUrl = 'http://localhost:3000/api/customers';  // local environment
  private apiUrl = 'https://employeebackend-production.up.railway.app/api/customers'; // live environment

  getCustomers() {
    return this.http.get(this.apiUrl);
  }

  createCustomer(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  checkAvailability(value: string) {
    return this.http.get(`${this.apiUrl}/check-availability?field=mobile&value=${value}`);
  }

  getCustomerById(id: string) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateCustomer(id: string, customer: any) {
    return this.http.put(`${this.apiUrl}/${id}`, customer);
  }

  deleteCustomer(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }


}
