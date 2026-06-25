import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

export interface BreadcrumbItem {
  label: string;
  route?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './breadcrumb.component.html',
  styles: [`
    .breadcrumb-nav { margin-bottom: 1.25rem; }
    .breadcrumb { font-size: .83rem; }
    .breadcrumb-item a { color: #3b82f6; text-decoration: none; &:hover { text-decoration: underline; } }
    .breadcrumb-item.active { color: #64748b; }
    .breadcrumb-item + .breadcrumb-item::before { color: #cbd5e1; }
  `]
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];
}
