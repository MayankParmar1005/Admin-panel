import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Appointment {

  private http = inject(HttpClient);

  // private apiUrl = 'http://localhost:3000/api/appointments';  // local environment
  private apiUrl = 'https://employeebackend-production.up.railway.app/api/appointments'; // live environment

  createAppointment(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  getAppointments() {
    return this.http.get(this.apiUrl);
  }

  getAppointmentById(id: string) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateAppointment(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  getCustomerByMobile(mobile: string) {
    return this.http.get(`${this.apiUrl}/mobile/${mobile}`);
  }

  deleteAppointment(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // get booked timeslots
  getBookedTimeslots(date: string) {
    return this.http.get(`${this.apiUrl}/booked-slots?date=${date}`);
  }

}
