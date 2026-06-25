import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ToastComponent } from '../../components/toast/toast.component';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent, FooterComponent, ToastComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  sidebarCollapsed = signal(false);
  mobileOpen = signal(false);

  onSidebarToggle(): void {
    if (window.innerWidth < 992) {
      this.mobileOpen.set(!this.mobileOpen());
    } else {
      this.sidebarCollapsed.set(!this.sidebarCollapsed());
    }
  }
}
