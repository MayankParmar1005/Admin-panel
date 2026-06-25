import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { Service } from '../../models';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbComponent],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  private dataService = inject(DataService);

  all: Service[] = [];
  filtered = signal<Service[]>([]);
  filterCat = 'All';
  categories = ['All', 'Hair', 'Skin', 'Waxing', 'Nails', 'Massage', 'Special'];

  ngOnInit(): void {
    this.all = this.dataService.getServices();
    this.filtered.set(this.all);
  }

  applyFilter(): void {
    this.filtered.set(this.filterCat === 'All' ? this.all : this.all.filter(s => s.category === this.filterCat));
  }
}
