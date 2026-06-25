import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-card.component.html',
  styles: [`
    .dash-card {
      background: #fff;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 2px 16px rgba(30,41,59,.07);
      border: 1px solid #f1f5f9;
      transition: transform .25s, box-shadow .25s;
      &:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(30,41,59,.12); }
    }
    .dash-card-body { display: flex; justify-content: space-between; align-items: center; }
    .dash-card-label { font-size: .82rem; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; color: #64748b; margin-bottom: .35rem; }
    .dash-card-value { font-size: 2rem; font-weight: 800; color: #1e293b; margin: 0 0 .4rem; line-height: 1; }
    .dash-card-change { font-size: .78rem; font-weight: 600; display: flex; align-items: center; gap: .25rem;
      &.positive { color: #10b981; }
      &.negative { color: #ef4444; }
    }
    .dash-card-icon {
      width: 60px; height: 60px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.6rem; flex-shrink: 0;
    }
    .dash-card--blue .dash-card-icon { background: #eff6ff; color: #3b82f6; }
    .dash-card--green .dash-card-icon { background: #f0fdf4; color: #10b981; }
    .dash-card--purple .dash-card-icon { background: #f5f3ff; color: #8b5cf6; }
    .dash-card--orange .dash-card-icon { background: #fff7ed; color: #f97316; }
  `]
})
export class DashboardCardComponent {
  @Input() label = '';
  @Input() value: number = 0;
  @Input() icon = '';
  @Input() color: 'blue' | 'green' | 'purple' | 'orange' = 'blue';
  @Input() change: number = 0;
  @Input() prefix = '';
  @Input() suffix = '';
}
