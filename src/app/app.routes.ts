import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
    {
        path: 'login',
        canActivate: [loginGuard],
        loadComponent: () =>
            import('./pages/login/login.component').then(m => m.LoginComponent),
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
            },
            {
                path: 'appointments',
                loadComponent: () =>
                    import('./pages/appointments/appointments.component').then(m => m.AppointmentsComponent),
            },
            {
                path: 'appointments/add',
                loadComponent: () =>
                    import('./pages/appointments/appointments.component').then(m => m.AppointmentsComponent),
            },
            {
                path: 'customers',
                loadComponent: () =>
                    import('./pages/customers/customers.component').then(m => m.CustomersComponent),
            },
            {
                path: 'customers/history',
                loadComponent: () =>
                    import('./pages/customers/customers.component').then(m => m.CustomersComponent),
            },
            {
                path: 'employees',
                loadComponent: () =>
                    import('./pages/employees/employees.component').then(m => m.EmployeesComponent),
            },
            {
                path: 'employees/add',
                loadComponent: () =>
                    import('./pages/employees/employees.component').then(m => m.EmployeesComponent),
            },
            {
                path: 'services',
                loadComponent: () =>
                    import('./pages/services/services.component').then(m => m.ServicesComponent),
            },
            {
                path: 'services/add',
                loadComponent: () =>
                    import('./pages/services/services.component').then(m => m.ServicesComponent),
            },
            {
                path: 'billing',
                loadComponent: () =>
                    import('./pages/billing/billing.component').then(m => m.BillingComponent),
            },
            {
                path: 'reports',
                loadComponent: () =>
                    import('./pages/reports/reports.component').then(m => m.ReportsComponent),
            },
            {
                path: 'settings',
                loadComponent: () =>
                    import('./pages/settings/settings.component').then(m => m.SettingsComponent),
            },
        ],
    },
    { path: '**', redirectTo: 'login' },
];
