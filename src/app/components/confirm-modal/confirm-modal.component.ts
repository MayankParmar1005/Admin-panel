import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-confirm-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './confirm-modal.component.html',
    styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {
    @Input() title: string = 'Confirm Action';
    @Input() message: string = 'Are you sure you want to proceed?';
    @Input() confirmText: string = 'Yes, Proceed';
    @Input() cancelText: string = 'Cancel';
    @Input() isDanger: boolean = false;

    @Output() confirm = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();

    onConfirm(): void {
        this.confirm.emit();
    }

    onCancel(): void {
        this.cancel.emit();
    }
}
