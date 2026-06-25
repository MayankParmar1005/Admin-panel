import { Component, Output, EventEmitter, inject, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, ConfirmModalComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  @Output() sidebarToggle = new EventEmitter<void>();

  notifOpen = false;
  profileOpen = false;
  showLogoutModal = false;

  getPageTitle(): string {
    const path = this.router.url.split('/')[1] || 'dashboard';
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      appointments: 'Appointments',
      customers: 'Customers',
      employees: 'Employees',
      services: 'Services',
      billing: 'Billing',
      reports: 'Reports',
      settings: 'Settings',
    };
    return titles[path] || 'Dashboard';
  }

  getPageSubtitle(): string {
    const path = this.router.url.split('/')[1] || 'dashboard';
    const subtitles: Record<string, string> = {
      dashboard: 'Welcome back! Here\'s what\'s happening today.',
      appointments: 'Manage your salon appointments',
      customers: 'View and manage your customer base',
      employees: 'Manage your salon team',
      services: 'Manage services & pricing',
      billing: 'Billing & invoices',
      reports: 'Analytics & business reports',
      settings: 'Configure your salon settings',
    };
    return subtitles[path] || '';
  }

  constructor(private eRef: ElementRef) { }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.closeAll();
    }
  }

  getUserInitials(): string {
    const name = this.authService.currentUser()?.name || 'AU';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  closeAll(): void {
    this.notifOpen = false;
    this.profileOpen = false;
  }

  logout(): void {
    this.profileOpen = false;
    this.showLogoutModal = true;
  }

  onLogoutConfirm(): void {
    this.showLogoutModal = false;
    this.authService.logout();
  }

  onLogoutCancel(): void {
    this.showLogoutModal = false;
  }
}
