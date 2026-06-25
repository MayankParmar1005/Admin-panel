import { Component, inject, OnInit, signal, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { EmployeeModel } from '../../models';
import { Employee } from '../../services/employee';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BreadcrumbComponent],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  private dataService = inject(DataService);
  private employeeService = inject(Employee);
  private fb = inject(FormBuilder);
  private renderer = inject(Renderer2);


  all: EmployeeModel[] = [];
  filtered = signal<EmployeeModel[]>([]);
  searchQuery = '';
  filterStatus = '';

  showAddModal = false;
  showViewModal = false;
  isEditMode = false;
  selectedEmployeeId: any = null;
  viewEmployee: EmployeeModel | null = null;
  addEmployeeForm!: FormGroup;

  private avatarColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f97316', '#ef4444', '#06b6d4', '#f59e0b', '#ec4899'];

  ngOnInit(): void {
    this.loadEmployees();
    this.initForm();
  }

  initForm(): void {
    this.addEmployeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      role: ['', Validators.required],
      specialization: [''],
      join_date: [new Date().toISOString().split('T')[0], Validators.required],
      status: ['active', Validators.required],
      rating: [5.0]
    });
  }

  applyFilter(): void {
    this.filtered.set(this.all.filter(e =>
      (!this.searchQuery || e.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || e.role.toLowerCase().includes(this.searchQuery.toLowerCase())) &&
      (!this.filterStatus || e.status === this.filterStatus)
    ));
  }

  getInitials(name: string): string { return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2); }
  getColor(name: string): string { return this.avatarColors[name.charCodeAt(0) % this.avatarColors.length]; }
  getStars(rating: number): number[] { return Array(Math.floor(rating)).fill(0); }

  // list all employee
  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (res: any) => {
        this.all = res;
        this.filtered.set(res);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  onView(employee: EmployeeModel): void {
    this.viewEmployee = employee;
    this.showViewModal = true;
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  onEdit(employee: EmployeeModel): void {
    this.isEditMode = true;
    this.selectedEmployeeId = employee.id;
    this.showAddModal = true;
    this.showViewModal = false;
    this.renderer.setStyle(document.body, 'overflow', 'hidden');

    // Format join_date to YYYY-MM-DD for date input
    let formattedDate = '';
    if (employee.join_date) {
      formattedDate = new Date(employee.join_date).toISOString().split('T')[0];
    }

    this.addEmployeeForm.patchValue({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      role: employee.role,
      specialization: employee.specialization,
      join_date: formattedDate,
      status: employee.status,
      rating: employee.rating
    });
  }

  onSubmit(): void {
    if (this.addEmployeeForm.valid) {
      const apiCall = this.isEditMode
        ? this.employeeService.updateEmployee(this.selectedEmployeeId, this.addEmployeeForm.value)
        : this.employeeService.createEmployee(this.addEmployeeForm.value);

      apiCall.subscribe({
        next: (res) => {
          this.loadEmployees();
          this.closeModal();
        },
        error: (err) => {
          console.error(`Error ${this.isEditMode ? 'updating' : 'adding'} employee:`, err);
        }
      });
    } else {
      this.addEmployeeForm.markAllAsTouched();
    }
  }

  closeModal(): void {
    this.showAddModal = false;
    this.showViewModal = false;
    this.isEditMode = false;
    this.selectedEmployeeId = null;
    this.viewEmployee = null;
    this.addEmployeeForm.reset({
      status: 'active',
      join_date: new Date().toISOString().split('T')[0],
      rating: 5.0
    });
    this.renderer.removeStyle(document.body, 'overflow');
  }
}
