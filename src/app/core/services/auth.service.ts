import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IUser } from '@app/core/models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private router = inject(Router);
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/users';

    private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
    isLoggedIn$ = this.isLoggedInSubject.asObservable();

    private currentUserSubject = new BehaviorSubject<IUser | null>(this.getUserFromStorage());
    currentUser$ = this.currentUserSubject.asObservable();

    private getUserFromStorage(): IUser | null {
        const userStr = localStorage.getItem('auth_user');
        return userStr ? JSON.parse(userStr) : null;
    }

    private hasToken(): boolean {
        return !!localStorage.getItem('auth_token');
    }

    login(email: string, password: string): Observable<boolean> {
        return this.http.get<IUser[]>(`${this.apiUrl}?email=${email}&password=${password}`).pipe(
            map(users => {
                if (users.length && users.length > 0) {
                    const user = users[0];
                    localStorage.setItem('auth_token', btoa(email));
                    localStorage.setItem('auth_user', JSON.stringify(user));
                    this.isLoggedInSubject.next(true);
                    this.currentUserSubject.next(user);
                    this.router.navigate(['/users']);
                    return true;
                }
                return false;
            }),
            catchError(error => {
                console.error('Login error', error);
                return of(false);
            })
        );
    }



    logout(): void {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        this.isLoggedInSubject.next(false);
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    isAuthenticated(): boolean {
        return this.isLoggedInSubject.value;
    }
}
