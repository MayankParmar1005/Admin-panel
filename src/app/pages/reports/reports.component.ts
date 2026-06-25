import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  private dataService = inject(DataService);

  revenueData: { month: string; revenue: number }[] = [];

  topServices = [
    { name: 'Bridal Package', pct: 92 },
    { name: 'Hair Coloring', pct: 78 },
    { name: 'Gold Facial', pct: 65 },
    { name: 'Haircut & Blow Dry', pct: 58 },
    { name: 'Nail Extensions', pct: 42 },
  ];

  staffPerf = [
    { name: 'Geeta Bhat', role: 'Senior Beautician', appts: 210, revenue: 178000, rating: 5.0, pct: 95 },
    { name: 'Swati Desai', role: 'Senior Stylist', appts: 195, revenue: 156000, rating: 4.9, pct: 88 },
    { name: 'Rinku Shah', role: 'Nail Artist', appts: 180, revenue: 108000, rating: 4.8, pct: 82 },
    { name: 'Pallavi Kulkarni', role: 'Beautician', appts: 162, revenue: 121500, rating: 4.7, pct: 78 },
    { name: 'Dipika More', role: 'Junior Stylist', appts: 145, revenue: 87000, rating: 4.5, pct: 65 },
  ];

  private colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f97316', '#ef4444'];

  ngOnInit(): void { this.revenueData = this.dataService.getRevenueData(); }

  getBarHeight(r: number): number {
    const max = Math.max(...this.revenueData.map(d => d.revenue));
    return (r / max) * 100;
  }

  getInitials(name: string): string { return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2); }
  getColor(name: string): string { return this.colors[name.charCodeAt(0) % this.colors.length]; }
}
