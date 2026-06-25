import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // email = 'admin@salon.com';
  // password = 'admin123';
  rememberMe = false;
  showPassword = false;
  submitted = false;
  errorMessage = signal('');
  loading = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  onLogin(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    setTimeout(() => {
      // const success = this.authService.login(this.loginForm.value);
      // this.loading.set(false);
      // if (success) {
      //   this.router.navigate(['/dashboard']);
      // } else {
      //   this.errorMessage.set('Invalid email or password. Please try again.');
      // }

      this.authService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          this.loading.set(false);
          localStorage.setItem('token', res.token);
          if (res.user) {
            localStorage.setItem('salon_user', JSON.stringify(res.user));
            this.authService.currentUser.set(res.user);
          }
          this.authService.isAuthenticated.set(true);

          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set('Invalid email or password. Please try again.');
          console.error('Login error:', err);
        }
      });

    }, 800);




  }
}
