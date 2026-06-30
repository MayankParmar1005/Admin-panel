import { Component, signal, inject, Output, EventEmitter, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  children?: { label: string; route: string }[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() mobileOpen = false;
  @Output() collapsedChange = new EventEmitter<boolean>();
  @Output() mobileClose = new EventEmitter<void>();

  @Input() isCollapsed = false;
  expandedMenus = new Set<string>();

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'bi-grid-1x2-fill', route: '/dashboard' },
    { label: 'Appointments', icon: 'bi-calendar-check-fill', route: '/appointments' },
    { label: 'Customers', icon: 'bi-people-fill', route: '/customers' },
    { label: 'Employees', icon: 'bi-person-badge-fill', route: '/employees' },
    { label: 'Services', icon: 'bi-stars', route: '/services' },
    { label: 'Billing', icon: 'bi-receipt-cutoff', route: '/billing' },
    { label: 'Reports', icon: 'bi-bar-chart-fill', route: '/reports' },
    { label: 'Settings', icon: 'bi-gear-fill', route: '/settings' },
  ];

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    this.collapsedChange.emit(this.isCollapsed);
  }

  toggleMenu(label: string): void {
    if (this.isCollapsed) {
      this.isCollapsed = false;
      this.collapsedChange.emit(false);
    }
    if (this.expandedMenus.has(label)) {
      this.expandedMenus.delete(label);
    } else {
      this.expandedMenus.add(label);
    }
  }

  onNavClick(): void {
    this.mobileClose.emit();
  }

  closeMobile(): void {
    this.mobileClose.emit();
  }
}
