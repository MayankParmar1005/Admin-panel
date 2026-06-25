import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styles: [`
    .app-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.85rem 1.5rem;
      background: #fff;
      border-top: 1px solid #e8edf3;
      font-size: 0.82rem;
      color: #64748b;
    }
    .footer-version {
      font-size:0.78rem;
      color:#94a3b8;
    }
  `]
})
export class FooterComponent { }
