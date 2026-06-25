import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  notifSettings = [
    { label: 'Appointment Reminders', desc: 'Send reminders to customers before appointments', enabled: true },
    { label: 'New Booking Alerts', desc: 'Get notified when a new booking is made', enabled: true },
    { label: 'Payment Confirmations', desc: 'Notify on successful payment collection', enabled: true },
    { label: 'Cancellation Alerts', desc: 'Alert when an appointment is cancelled', enabled: false },
    { label: 'Weekly Reports', desc: 'Receive weekly business summary emails', enabled: true },
  ];
}
