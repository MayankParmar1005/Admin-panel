import { Component, inject, OnInit, signal, Renderer2, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { EmployeeModel, ServiceModel, Appointment } from '../../models';

import { DataService } from '../../services/data.service';
import { Employee as EmployeeService } from '../../services/employee';
import { Appointment as AppointmentService } from '../../services/appointment';
import { SalonService } from '../../services/salon-service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BreadcrumbComponent, ConfirmModalComponent, BsDatepickerModule, PaginationModule],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {
  protected Math = Math;
  private dataService = inject(DataService);
  private employeeService = inject(EmployeeService);
  private appointmentService = inject(AppointmentService);
  private salonService = inject(SalonService);
  private fb = inject(FormBuilder);
  private renderer = inject(Renderer2);
  private toastService = inject(ToastService);

  all: Appointment[] = [];
  filtered = signal<Appointment[]>([]);
  isLoading = signal<boolean>(true);
  employees: EmployeeModel[] = [];
  services: ServiceModel[] = [];

  searchQuery = '';
  filterStatus = '';
  filterDate: Date | undefined = undefined;
  showAddModal = false;
  showConfirmModal = false;
  showDeleteModal = false;
  appointmentToDelete: Appointment | null = null;
  minDate: Date = new Date();
  maxDate: Date = new Date();

  currentPage = signal(1);
  itemsPerPage = 10;
  pagedItems = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filtered().slice(start, end);
  });
  isEditMode = false;
  editId: string | null = null;
  addAppointmentForm!: FormGroup;

  private avatarColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f97316', '#ef4444', '#06b6d4'];

  timeOptions: string[] = [];
  bookedTimeslots: string[] = [];
  originalEditDate: string | null = null;
  originalEditTime: string | null = null;


  ngOnInit(): void {
    this.setDateLimits();
    this.generateTimeOptions();
    this.loadAppointments();
    this.loadDropdownData();
    this.initForm();
  }

  generateTimeOptions(): void {
    const startHour = 9;
    const endHour = 21;
    for (let h = startHour; h <= endHour; h++) {
      const hour = h.toString().padStart(2, '0');
      this.timeOptions.push(`${hour}:00`);
    }
  }

  setDateLimits(): void {
    this.minDate = new Date();
    this.minDate.setHours(0, 0, 0, 0);

    this.maxDate = new Date(this.minDate);
    this.maxDate.setMonth(this.maxDate.getMonth() + 2);
    this.maxDate.setHours(23, 59, 59, 999);
  }

  initForm(): void {
    this.addAppointmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.email]],
      staff_id: [null, Validators.required],
      service_id: [null, Validators.required],
      appointment_date: [new Date(), Validators.required],
      appointment_time: ['10:00', Validators.required],
      total_amount: [0, [Validators.required, Validators.min(0)]],
      status: [{ value: 'scheduled', disabled: !this.isEditMode }]
    });

    this.addAppointmentForm.get('appointment_date')?.valueChanges.subscribe(date => {
      if (date) {
        this.fetchBookedTimeslots(date);
      }
    });
  }

  fetchBookedTimeslots(date: Date): void {
    const formattedDate = this.formatDateToYYYYMMDD(date);
    this.appointmentService.getBookedTimeslots(formattedDate).subscribe({
      next: (res: any) => {
        if (res && res.bookedSlots) {
          this.bookedTimeslots = res.bookedSlots.map((time: string) => time.substring(0, 5));
          const currentTime = this.addAppointmentForm.get('appointment_time')?.value;
          if (currentTime && this.isTimeBooked(currentTime)) {
            this.addAppointmentForm.get('appointment_time')?.setValue('');
          }
        } else {
          this.bookedTimeslots = [];
        }
      },
      error: (err) => {
        console.error('Error fetching booked slots:', err);
        this.bookedTimeslots = [];
      }
    });
  }

  isTimeBooked(time: string): boolean {
    if (this.isEditMode) {
      const selectedDate = this.addAppointmentForm.get('appointment_date')?.value;
      const formattedDate = this.formatDateToYYYYMMDD(selectedDate);
      if (formattedDate === this.originalEditDate && time === this.originalEditTime) {
        return false;
      }
    }
    return this.bookedTimeslots.includes(time);
  }

  loadAppointments(): void {
    this.isLoading.set(true);
    this.appointmentService.getAppointments().subscribe({
      next: (res: any) => {
        this.all = res;
        this.filtered.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
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
    this.salonService.getServices().subscribe({
      next: (res: any) => this.services = res,
      error: (err) => console.error('Error loading services:', err)
    });
  }

  applyFilter(): void {
    this.currentPage.set(1);
    this.filtered.set(this.all.filter((a: any) => {
      const matchesSearch = !this.searchQuery ||
        (a.customer_name && a.customer_name.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        (this.getServiceName(a.service_id).toLowerCase().includes(this.searchQuery.toLowerCase()));

      const matchesStatus = !this.filterStatus || a.status === this.filterStatus;

      let matchesDate = true;
      // Updated check for undefined
      if (this.filterDate) {
        const selectedDateStr = this.formatDateToYYYYMMDD(this.filterDate);
        const recordDate = a.appointment_date ? a.appointment_date.trim() : '';
        matchesDate = recordDate === selectedDateStr;
      }

      return matchesSearch && matchesStatus && matchesDate;
    }));
  }

  // Robust helper method to format date matching local timezone
  private formatDateToYYYYMMDD(date: any): string {
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    // If it's already a string, try to slice the first 10 characters (YYYY-MM-DD)
    if (typeof date === 'string') {
      return date.trim();
    }
    return '';
  }

  onDateChange(value: Date | undefined): void {
    this.filterDate = value;
    this.applyFilter();
  }

  resetFilter(): void {
    this.searchQuery = '';
    this.filterStatus = '';
    this.filterDate = undefined;
    this.applyFilter();
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
    this.originalEditDate = null;
    this.originalEditTime = null;
    this.addAppointmentForm.reset({
      status: 'scheduled',
      appointment_date: new Date(),
      appointment_time: '10:00',
      total_amount: 0
    });
    this.fetchBookedTimeslots(new Date());
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

        const formattedDate = res.appointment_date ? res.appointment_date : '';
        const formattedTime = res.appointment_time ? res.appointment_time.substring(0, 5) : '';

        this.originalEditDate = formattedDate;
        this.originalEditTime = formattedTime;

        this.addAppointmentForm.patchValue({
          name: res.customer_name || res.name,
          mobile: res.customer_mobile,
          email: res.customer_email,
          staff_id: res.staff_id,
          service_id: res.service_id,
          appointment_date: formattedDate ? new Date(formattedDate) : null,
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
      appointment_date: new Date(),
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

  getServiceName(id: number | null): string {
    const svc = this.services.find(s => s.id === id);
    return svc ? svc.name : 'Unknown';
  }

  onDelete(id: any): void {
    const appointment = this.all.find(a => a.id === id);
    if (appointment) {
      this.appointmentToDelete = appointment;
      this.showDeleteModal = true;
    }
  }

  confirmDeleteAppointment(): void {
    if (this.appointmentToDelete) {
      this.appointmentService.deleteAppointment(this.appointmentToDelete.id.toString()).subscribe({
        next: (res: any) => {
          this.loadAppointments();
          this.toastService.success('Appointment deleted successfully');
          this.cancelDeleteAppointment();
        },
        error: (err: any) => {
          console.error('Error deleting appointment:', err);
          this.toastService.error('Failed to delete appointment');
          this.cancelDeleteAppointment();
        }
      });
    }
  }

  cancelDeleteAppointment(): void {
    this.showDeleteModal = false;
    this.appointmentToDelete = null;
  }
}
