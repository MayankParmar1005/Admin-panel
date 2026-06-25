import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-spinner.component.html',
  styles: [`
    .spinner-overlay {
      position: fixed; inset: 0;
      background: rgba(255,255,255,.8);
      display: flex; align-items: center; justify-content: center;
      z-index: 9999;
      backdrop-filter: blur(4px);
    }
    .spinner-box { text-align: center; }
  `]
})
export class LoadingSpinnerComponent { }
