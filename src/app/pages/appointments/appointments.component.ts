import { Component, inject, OnInit, signal, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';

import { EmployeeModel, Service, Appointment } from '../../models';

import { DataService } from '../../services/data.service';
import { Employee as EmployeeService } from '../../services/employee';
import { Appointment as AppointmentService } from '../../services/appointment';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BreadcrumbComponent, ConfirmModalComponent],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {
  private dataService = inject(DataService);
  private employeeService = inject(EmployeeService);
  private appointmentService = inject(AppointmentService);
  private fb = inject(FormBuilder);
  private renderer = inject(Renderer2);
  private toastService = inject(ToastService);

  all: Appointment[] = [];
  filtered = signal<Appointment[]>([]);
  employees: EmployeeModel[] = [];
  services: Service[] = [];

  searchQuery = '';
  filterStatus = '';
  filterDate = '';
  showAddModal = false;
  showConfirmModal = false;
  isEditMode = false;
  editId: string | null = null;
  addAppointmentForm!: FormGroup;

  private avatarColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f97316', '#ef4444', '#06b6d4'];

  ngOnInit(): void {
    this.loadAppointments();
    this.loadDropdownData();
    this.initForm();
  }

  initForm(): void {
    this.addAppointmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.email]],
      staff_id: [null, Validators.required],
      service_name: ['', Validators.required],
      appointment_date: [new Date().toISOString().split('T')[0], Validators.required],
      appointment_time: ['10:00', Validators.required],
      total_amount: [0, [Validators.required, Validators.min(0)]],
      status: [{ value: 'scheduled', disabled: !this.isEditMode }]
    });
  }

  loadAppointments(): void {

    this.appointmentService.getAppointments().subscribe({
      next: (res: any) => {
        this.all = res;
        this.filtered.set(res);
      },
      error: (err) => {
        console.error(err);
      }
    });

    // this.all = this.dataService.getAppointments();
    // this.filtered.set(this.all);
  }

  loadDropdownData(): void {
    this.employeeService.getEmployees().subscribe({
      next: (res: any) => this.employees = res,
      error: (err) => console.error('Error loading employees:', err)
    });
    this.services = this.dataService.getServices(); // static data for services
  }

  applyFilter(): void {
    this.filtered.set(this.all.filter((a: any) =>
      (!this.searchQuery ||
        (a.customer_name && a.customer_name.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        (a.service_name && a.service_name.toLowerCase().includes(this.searchQuery.toLowerCase()))) &&
      (!this.filterStatus || a.status === this.filterStatus) &&
      (!this.filterDate || a.appointment_date === this.filterDate)
    ));
  }

  getInitials(name: string): string {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getColor(name: string): string {
    if (!name) return '#cbd5e1';
    return this.avatarColors[name.charCodeAt(0) % this.avatarColors.length];
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.editId = null;
    this.addAppointmentForm.reset({
      status: 'scheduled',
      appointment_date: new Date().toISOString().split('T')[0],
      appointment_time: '10:00',
      total_amount: 0
    });
    this.addAppointmentForm.get('status')?.disable();
    this.addAppointmentForm.get('name')?.enable();
    this.addAppointmentForm.get('mobile')?.enable();
    this.addAppointmentForm.get('email')?.enable();
    this.showAddModal = true;
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  openEditModal(appointment: Appointment): void {
    this.isEditMode = true;
    this.editId = appointment.id.toString();
    this.showAddModal = true;
    this.renderer.setStyle(document.body, 'overflow', 'hidden');

    this.appointmentService.getAppointmentById(this.editId).subscribe({
      next: (res: any) => {
        // Map backend fields to form fields if necessary
        // Based on the HTML, it seems they match mostly, but wait:
        // Customer name is apt.customer_name in table but 'name' in form?
        // Let's check the res object. If it comes from backend, it might be customer_name.

        const formattedDate = res.appointment_date ? res.appointment_date.split('T')[0] : '';
        const formattedTime = res.appointment_time ? res.appointment_time.substring(0, 5) : '';

        this.addAppointmentForm.patchValue({
          name: res.customer_name || res.name,
          mobile: res.customer_mobile,
          email: res.customer_email,
          staff_id: res.staff_id,
          service_name: res.service_name,
          appointment_date: formattedDate,
          appointment_time: formattedTime,
          total_amount: res.total_amount,
          status: res.status
        });
        this.addAppointmentForm.get('status')?.enable();
        this.addAppointmentForm.get('name')?.disable();
        this.addAppointmentForm.get('mobile')?.disable();
        this.addAppointmentForm.get('email')?.disable();
      },
      error: (err) => {
        console.error('Error fetching appointment:', err);
        this.closeModal();
      }
    });
  }

  closeModal(): void {
    this.showAddModal = false;
    this.showConfirmModal = false;
    this.isEditMode = false;
    this.editId = null;
    this.addAppointmentForm.reset({
      status: 'scheduled',
      appointment_date: new Date().toISOString().split('T')[0],
      appointment_time: '10:00',
      total_amount: 0
    });
    this.renderer.removeStyle(document.body, 'overflow');
  }

  onMobileBlur(): void {
    const mobile = this.addAppointmentForm.get('mobile')?.value;
    if (mobile && mobile.length === 10 && !this.isEditMode) {
      this.appointmentService.getCustomerByMobile(mobile).subscribe({
        next: (res: any) => {
          if (res.exists && res.customer) {
            this.addAppointmentForm.patchValue({
              name: res.customer.name,
              email: res.customer.email
            });
          }
        },
        error: (err) => console.error('Error fetching customer:', err)
      });
    }
  }

  handleBackdropClick(): void {
    if (this.addAppointmentForm.dirty) {
      this.showConfirmModal = true;
    } else {
      this.closeModal();
    }
  }

  onSubmit(): void {
    if (this.addAppointmentForm.invalid) {
      this.addAppointmentForm.markAllAsTouched();
      return;
    }

    const appointmentData = this.addAppointmentForm.getRawValue();

    if (this.isEditMode && this.editId) {
      this.appointmentService.updateAppointment(this.editId, appointmentData).subscribe({
        next: (res: any) => {
          this.loadAppointments();
          this.closeModal();
          this.toastService.success('Appointment updated successfully');
        },
        error: (err: any) => {
          console.error(err);
          this.toastService.error('Failed to update appointment');
        }
      });
    } else {
      this.appointmentService.createAppointment(appointmentData).subscribe({
        next: (res: any) => {
          this.loadAppointments();
          this.closeModal();
          this.toastService.success('Appointment created successfully');
        },
        error: (err: any) => {
          console.error(err);
          this.toastService.error('Failed to create appointment');
        }
      });
    }
  }

  getStaffName(id: number | null): string {
    const staff = this.employees.find(e => e.id === id);
    return staff ? staff.name : 'Unknown';
  }
}
