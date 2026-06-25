import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss'],
    animations: [
        trigger('toastAnimation', [
            transition(':enter', [
                style({ transform: 'translateY(-100%)', opacity: 0 }),
                animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
            ]),
            transition(':leave', [
                animate('200ms ease-in', style({ transform: 'translateY(-20px)', opacity: 0 }))
            ])
        ])
    ]
})
export class ToastComponent {
    toastService = inject(ToastService);
}
