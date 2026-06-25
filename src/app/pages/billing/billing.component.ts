import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { Invoice } from '../../models';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  private dataService = inject(DataService);

  invoices: Invoice[] = [];

  get totalPaid() { return this.invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0); }
  get totalPending() { return this.invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.total, 0); }
  get refundCount() { return this.invoices.filter(i => i.status === 'refunded').length; }

  ngOnInit(): void {
    this.invoices = this.dataService.getInvoices();
  }
}
