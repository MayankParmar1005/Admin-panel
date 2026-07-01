import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);

    // private authUrl = 'http://localhost:3000/api/auth';  // local environment

    private authUrl = `${environment.apiUrl}/auth`;

    private readonly TOKEN_KEY = 'token';
    private readonly USER_KEY = 'salon_user';

    currentUser = signal<User | null>(null);
    isAuthenticated = signal<boolean>(false);

    private readonly dummyUsers: { email: string; password: string; user: User }[] = [
        {
            email: 'admin@salon.com',
            password: 'admin123',
            user: {
                id: 1,
                name: 'Admin User',
                email: 'admin@salon.com',
                role: 'Administrator',
            },
        },
        {
            email: 'manager@salon.com',
            password: 'manager123',
            user: {
                id: 2,
                name: 'Sarah Johnson',
                email: 'manager@salon.com',
                role: 'Manager',
            },
        },
    ];

    constructor() {
        this.loadFromStorage();
    }

    private loadFromStorage(): void {
        const token = localStorage.getItem(this.TOKEN_KEY);
        const userStr = localStorage.getItem(this.USER_KEY);

        if (token) {
            this.isAuthenticated.set(true);
            if (userStr) {
                try {
                    this.currentUser.set(JSON.parse(userStr));
                } catch (e) {
                    console.error('Error parsing user from storage', e);
                }
            }
        } else {
            this.isAuthenticated.set(false);
            this.currentUser.set(null);
        }
    }

    login1(email: string, password: string): boolean {
        const match = this.dummyUsers.find(
            (u) => u.email === email && u.password === password
        );
        if (match) {
            const fakeToken = btoa(`${email}:${Date.now()}`);
            localStorage.setItem(this.TOKEN_KEY, fakeToken);
            // localStorage.setItem(this.USER_KEY, JSON.stringify(match.user));
            this.currentUser.set(match.user);
            this.isAuthenticated.set(true);
            return true;
        }
        return false;
    }

    login(data: any) {
        return this.http.post(this.authUrl + '/login', data);
    }

    logout1(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        // localStorage.removeItem(this.USER_KEY);
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
        this.router.navigate(['/login']);
    }

    logout() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.isAuthenticated.set(false);
        this.currentUser.set(null);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }
}
