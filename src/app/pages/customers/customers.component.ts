import { Component, inject, OnInit, signal, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { CustomerModel } from '../../models';
import { Customer } from '../../services/customer';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BreadcrumbComponent],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  private dataService = inject(DataService);
  private customerService = inject(Customer);
  private fb = inject(FormBuilder);
  private renderer = inject(Renderer2);
  private toastService = inject(ToastService);

  all: CustomerModel[] = [];
  filtered = signal<CustomerModel[]>([]);
  searchQuery = '';
  filterStatus = '';

  showAddModal = false;
  addCustomerForm!: FormGroup;
  isMobileTaken = signal<boolean>(false);
  isMobileTakenMsg: string = '';
  isEditMode = false;
  selectedCustomerId: string | null = null;

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
    this.filtered.set(this.all.filter(c =>
      (!this.searchQuery || c.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || c.email.toLowerCase().includes(this.searchQuery.toLowerCase())) &&
      (!this.filterStatus || c.status === this.filterStatus)
    ));
  }

  getInitials(name: string): string { return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2); }
  getColor(name: string): string { return this.avatarColors[name.charCodeAt(0) % this.avatarColors.length]; }

  // list all employee
  loadCustomer(): void {
    this.customerService.getCustomers().subscribe({
      next: (res: any) => {
        this.all = res;
        this.filtered.set(res);
      },
      error: (err: any) => {
        console.error(err);
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
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: (res: any) => {
          this.loadCustomer();
          this.toastService.success('Customer deleted successfully');
        },
        error: (err: any) => {
          console.error('Error deleting customer:', err);
          this.toastService.error((err?.error?.message) ? err.error.message : 'Failed to delete customer');
        }
      });
    }
  }

}
