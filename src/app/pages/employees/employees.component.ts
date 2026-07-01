import { Component, inject, OnInit, signal, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { EmployeeModel } from '../../models';
import { Employee } from '../../services/employee';
import { ToastService } from '../../services/toast.service';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BreadcrumbComponent, ConfirmModalComponent],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  private dataService = inject(DataService);
  private employeeService = inject(Employee);
  private fb = inject(FormBuilder);
  private renderer = inject(Renderer2);
  private toastService = inject(ToastService);


  all: EmployeeModel[] = [];
  filtered = signal<EmployeeModel[]>([]);
  isLoading = signal<boolean>(true);
  searchQuery = '';
  filterStatus = '';

  showAddModal = false;
  showViewModal = false;
  isEditMode = false;
  selectedEmployeeId: any = null;
  viewEmployee: EmployeeModel | null = null;
  addEmployeeForm!: FormGroup;

  selectedFile: File | null = null;
  imagePreview: string | null = null;

  showDeleteConfirm = signal(false);
  deleteEmployeeId: number | null = null;

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

  getImageUrl(fileName: string | undefined): string | null {
    if (!fileName) return null;
    // If it's already a full URL or base64, return as is
    if (fileName.startsWith('http') || fileName.startsWith('data:')) {
      return fileName;
    }
    // Assuming backend serves images from the 'uploads' directory
    // return `http://localhost:3000/uploads/${fileName}`;
    return `https://employeebackend-production.up.railway.app/uploads/${fileName}`; // for live
  }

  // list all employee
  loadEmployees(): void {
    this.isLoading.set(true);
    this.employeeService.getEmployees().subscribe({
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

    // Show existing avatar as preview
    this.imagePreview = this.getImageUrl(employee.image_url || employee.avatar) || null;
    this.selectedFile = null;

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

  onFileSelect(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      // Generate live preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile!);
    }
  }

  onSubmit(): void {
    if (this.addEmployeeForm.valid) {
      // Build FormData to support file upload
      const formData = new FormData();
      const values = this.addEmployeeForm.value;
      Object.keys(values).forEach(key => {
        if (values[key] !== null && values[key] !== undefined) {
          formData.append(key, values[key]);
        }
      });
      if (this.selectedFile) {
        formData.append('employee_image', this.selectedFile);
      }

      const apiCall = this.isEditMode
        ? this.employeeService.updateEmployee(this.selectedEmployeeId, formData)
        : this.employeeService.createEmployee(formData);

      const action = this.isEditMode ? 'updated' : 'added';
      apiCall.subscribe({
        next: (res) => {
          this.loadEmployees();
          this.closeModal();
          this.toastService.success(`Employee ${action} successfully!`);
        },
        error: (err) => {
          console.error(`Error ${this.isEditMode ? 'updating' : 'adding'} employee:`, err);
          this.toastService.error(`Failed to ${this.isEditMode ? 'update' : 'add'} employee. Please try again.`);
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
    this.selectedFile = null;
    this.imagePreview = null;
    this.addEmployeeForm.reset({
      status: 'active',
      join_date: new Date().toISOString().split('T')[0],
      rating: 5.0
    });
    this.renderer.removeStyle(document.body, 'overflow');
  }

  onDelete(id: number): void {
    this.deleteEmployeeId = id;
    this.showDeleteConfirm.set(true);
  }

  confirmDelete(): void {
    if (this.deleteEmployeeId === null) return;
    this.employeeService.deleteEmployee(this.deleteEmployeeId).subscribe({
      next: () => {
        this.loadEmployees();
        this.toastService.success('Employee deleted successfully!');
      },
      error: (err) => {
        console.error('Error deleting employee:', err);
        this.toastService.error('Failed to delete employee. Please try again.');
      }
    });
    this.showDeleteConfirm.set(false);
    this.deleteEmployeeId = null;
  }
}
