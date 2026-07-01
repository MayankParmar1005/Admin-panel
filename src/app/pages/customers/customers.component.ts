import { Component, inject, OnInit, signal, Renderer2, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { CustomerModel } from '../../models';
import { Customer } from '../../services/customer';
import { ToastService } from '../../services/toast.service';

import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BreadcrumbComponent, PaginationModule, ConfirmModalComponent],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  protected Math = Math;
  private dataService = inject(DataService);
  private customerService = inject(Customer);
  private fb = inject(FormBuilder);
  private renderer = inject(Renderer2);
  private toastService = inject(ToastService);

  all: CustomerModel[] = [];
  filtered = signal<CustomerModel[]>([]);
  isLoading = signal<boolean>(true);
  searchQuery = '';
  filterStatus = '';

  currentPage = signal(1);
  itemsPerPage = 10;
  pagedItems = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filtered().slice(start, end);
  });

  showAddModal = false;
  addCustomerForm!: FormGroup;
  isMobileTaken = signal<boolean>(false);
  isMobileTakenMsg: string = '';
  isEditMode = false;
  selectedCustomerId: string | null = null;
  showAppointmentsModal = false;
  selectedCustomerAppointments = signal<any[]>([]);
  isLoadingAppointments = signal<boolean>(false);
  viewingCustomerName = '';

  showDeleteConfirm = signal(false);
  customerToDelete: CustomerModel | null = null;

  get activeCount() { return this.all.filter(c => c.status === 'active').length; }
  get topCustomersCount() { return this.all.filter(c => c.visits >= 10).length; }
  get totalRevenue() { return this.all.reduce((sum, c) => sum + c.total_spent, 0); }

  private avatarColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f97316', '#ef4444', '#06b6d4'];

  ngOnInit(): void {
    this.loadCustomer();
    this.initForm();
  }

  initForm(): void {
    this.addCustomerForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }

  applyFilter(): void {
    this.currentPage.set(1);
    this.filtered.set(this.all.filter(c =>
      (!this.searchQuery ||
        c.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (c.mobile && c.mobile.includes(this.searchQuery))) &&
      (!this.filterStatus || c.status === this.filterStatus)
    ));
  }

  getInitials(name: string): string { return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2); }
  getColor(name: string): string { return this.avatarColors[name.charCodeAt(0) % this.avatarColors.length]; }

  // list all employee
  loadCustomer(): void {
    this.isLoading.set(true);
    this.customerService.getCustomers().subscribe({
      next: (res: any) => {
        this.all = res;
        this.filtered.set(res);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedCustomerId = null;
    this.addCustomerForm.reset();
    this.addCustomerForm.get('mobile')?.enable();
    this.isMobileTaken.set(false);
    this.showAddModal = true;
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  openEditModal(id: any): void {
    this.isEditMode = true;
    this.selectedCustomerId = id;
    this.isMobileTaken.set(false);
    this.customerService.getCustomerById(id).subscribe({
      next: (res: any) => {
        this.addCustomerForm.patchValue({
          name: res.name,
          email: res.email,
          mobile: res.mobile
        });
        this.addCustomerForm.get('mobile')?.disable();
        this.showAddModal = true;
        this.renderer.setStyle(document.body, 'overflow', 'hidden');
      },
      error: (err: any) => {
        console.error('Error fetching customer details:', err);
        this.toastService.error('Failed to fetch customer details');
      }
    });
  }

  closeModal(): void {
    this.showAddModal = false;
    this.showAppointmentsModal = false;
    this.showDeleteConfirm.set(false);
    this.renderer.removeStyle(document.body, 'overflow');
  }

  onSubmit(): void {
    if (this.addCustomerForm.invalid || this.isMobileTaken()) {
      this.addCustomerForm.markAllAsTouched();
      return;
    }

    if (this.isEditMode && this.selectedCustomerId) {
      this.customerService.updateCustomer(this.selectedCustomerId, this.addCustomerForm.getRawValue()).subscribe({
        next: (res: any) => {
          this.loadCustomer();
          this.closeModal();
          this.toastService.success('Customer updated successfully');
        },
        error: (err: any) => {
          console.error(err);
          this.toastService.error('Failed to update customer');
        }
      });
    } else {
      this.customerService.createCustomer(this.addCustomerForm.getRawValue()).subscribe({
        next: (res: any) => {
          this.loadCustomer();
          this.closeModal();
          this.toastService.success('Customer added successfully');
        },
        error: (err: any) => {
          console.error(err);
          this.toastService.error('Failed to add customer');
        }
      });
    }
  }

  checkMobileAvailability(): void {
    const mobile = this.addCustomerForm.get('mobile')?.value;
    if (mobile && mobile.length === 10 && /^[0-9]+$/.test(mobile)) {
      this.customerService.checkAvailability(mobile).subscribe({
        next: (res: any) => {
          this.isMobileTaken.set(!res.isAvailable);
          this.isMobileTakenMsg = res.message
        },
        error: (err: any) => {
          console.error('Error checking availability:', err);
        }
      });
    }
  }

  onDelete(id: any): void {
    const customer = this.all.find(c => c.id === id);
    if (customer) {
      this.customerToDelete = customer;
      this.showDeleteConfirm.set(true);
    }
  }

  confirmDelete(): void {
    if (this.customerToDelete) {
      this.customerService.deleteCustomer(this.customerToDelete.id).subscribe({
        next: (res: any) => {
          this.loadCustomer();
          this.toastService.success('Customer deleted successfully');
          this.cancelDelete();
        },
        error: (err: any) => {
          console.error('Error deleting customer:', err);
          this.toastService.error((err?.error?.message) ? err.error.message : 'Failed to delete customer');
          this.cancelDelete();
        }
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.customerToDelete = null;
  }

  viewAppointments(customer: CustomerModel): void {
    this.viewingCustomerName = customer.name;
    this.selectedCustomerAppointments.set([]);
    this.isLoadingAppointments.set(true);
    this.showAppointmentsModal = true;
    this.renderer.setStyle(document.body, 'overflow', 'hidden');

    this.customerService.getCustomerAppointmentList(customer.id.toString()).subscribe({
      next: (res: any) => {
        this.selectedCustomerAppointments.set(res);
        this.isLoadingAppointments.set(false);
      },
      error: (err: any) => {
        console.error('Error fetching customer appointments:', err);
        this.toastService.error('Failed to fetch appointment history');
        this.isLoadingAppointments.set(false);
        this.closeModal();
      }
    });
  }

}
