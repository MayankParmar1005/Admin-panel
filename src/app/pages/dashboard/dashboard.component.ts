import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';
import { DashboardCardComponent } from '../../components/dashboard-card/dashboard-card.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { DashboardStats, Appointment, CustomerModel, RevenueData } from '../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DashboardCardComponent, BreadcrumbComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private dataService = inject(DataService);

  stats!: DashboardStats;
  revenueData: RevenueData[] = [];
  recentAppointments: Appointment[] = [];
  recentCustomers: CustomerModel[] = [];

  private avatarColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f97316', '#ef4444', '#06b6d4', '#f59e0b', '#ec4899'];

  ngOnInit(): void {
    this.stats = this.dataService.getStats();
    this.revenueData = this.dataService.getRevenueData();
    // this.recentAppointments = this.dataService.getAppointments().slice(0, 5);
    // this.recentCustomers = this.dataService.getCustomers().slice(0, 6);
  }

  getBarHeight(revenue: number): number {
    const max = Math.max(...this.revenueData.map(d => d.revenue));
    return (revenue / max) * 100;
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getAvatar(name: string): string {
    const idx = name.charCodeAt(0) % this.avatarColors.length;
    return this.avatarColors[idx];
  }
}
