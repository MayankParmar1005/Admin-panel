import { Component, inject, OnInit, signal, Renderer2, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { ServiceModel } from '../../models';
import { SalonService } from '../../services/salon-service';
import { ToastService } from '../../services/toast.service';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BreadcrumbComponent, ConfirmModalComponent, PaginationModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  private dataService = inject(DataService);
  private salonService = inject(SalonService);
  private fb = inject(FormBuilder);
  private renderer = inject(Renderer2);
  private toastService = inject(ToastService);

  all: ServiceModel[] = [];
  filtered = signal<ServiceModel[]>([]);
  isLoading = signal<boolean>(true);
  filterCat = 'All';
  categories = ['Hair', 'Skin', 'Waxing', 'Nail', 'Massage', 'Special'];
  allCategories = ['All', ...this.categories];

  protected Math = Math;
  currentPage = signal(1);
  itemsPerPage = 10;
  pagedItems = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filtered().slice(start, end);
  });

  showAddModal = signal(false);
  addServiceForm!: FormGroup;
  isEditMode = false;
  selectedServiceId: string | null = null;

  showDeleteConfirm = signal(false);
  serviceToDelete: ServiceModel | null = null;

  ngOnInit(): void {
    this.loadServices();
    this.initForm();
  }

  initForm(): void {
    this.addServiceForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      category: ['', Validators.required],
      duration: [30, [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.maxLength(200)],
      status: ['active', Validators.required]
    });
  }

  applyFilter(): void {
    this.currentPage.set(1);
    this.filtered.set(this.filterCat === 'All' ? this.all : this.all.filter(s => s.category === this.filterCat));
  }

  getCategoryCount(cat: string): number {
    if (cat === 'All') return this.all.length;
    return this.all.filter(s => s.category === cat).length;
  }

  // list all salon services
  loadServices(): void {
    this.isLoading.set(true);
    this.salonService.getServices().subscribe({
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

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedServiceId = null;
    this.addServiceForm.reset({
      duration: 30,
      status: 'active',
      category: ''
    });
    this.showAddModal.set(true);
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  openEditModal(service: ServiceModel): void {
    this.isEditMode = true;
    this.selectedServiceId = service.id.toString();

    this.salonService.getServiceById(this.selectedServiceId).subscribe({
      next: (res: any) => {
        this.addServiceForm.patchValue({
          name: res.name,
          category: res.category,
          duration: res.duration,
          price: res.price,
          description: res.description,
          status: res.status
        });
        this.showAddModal.set(true);
        this.renderer.setStyle(document.body, 'overflow', 'hidden');
      },
      error: (err: any) => {
        console.error('Error fetching service details:', err);
        this.toastService.error('Failed to fetch service details');
      }
    });
  }

  closeModal(): void {
    this.showAddModal.set(false);
    this.renderer.removeStyle(document.body, 'overflow');
  }

  onSubmit(): void {
    if (this.addServiceForm.invalid) {
      this.addServiceForm.markAllAsTouched();
      return;
    }

    const formData = this.addServiceForm.value;

    if (this.isEditMode && this.selectedServiceId) {
      this.salonService.updateService(this.selectedServiceId, formData).subscribe({
        next: (res: any) => {
          this.loadServices();
          this.closeModal();
          this.toastService.success('Service updated successfully');
        },
        error: (err: any) => {
          console.error(err);
          this.toastService.error('Failed to update service');
        }
      });
    } else {
      this.salonService.createService(formData).subscribe({
        next: (res: any) => {
          this.loadServices();
          this.closeModal();
          this.toastService.success('Service added successfully');
        },
        error: (err: any) => {
          console.error(err);
          this.toastService.error('Failed to add service');
        }
      });
    }
  }

  onDelete(id: any): void {
    const service = this.all.find(s => s.id === id);
    if (service) {
      this.serviceToDelete = service;
      this.showDeleteConfirm.set(true);
    }
  }

  confirmDelete(): void {
    if (this.serviceToDelete) {
      this.salonService.deleteService(this.serviceToDelete.id.toString()).subscribe({
        next: (res: any) => {
          this.loadServices();
          this.toastService.success('Service deleted successfully');
          this.cancelDelete();
        },
        error: (err: any) => {
          console.error('Error deleting service:', err);
          this.toastService.error(err?.error?.message || 'Failed to delete service');
          this.cancelDelete();
        }
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.serviceToDelete = null;
  }
}
