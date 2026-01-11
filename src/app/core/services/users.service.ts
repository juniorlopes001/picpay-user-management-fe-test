import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IUser } from '@app/core/models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private apiUrl = 'http://localhost:3000/users';

    private usersSubject = new BehaviorSubject<IUser[]>([]);
    users$ = this.usersSubject.asObservable();

    constructor(private http: HttpClient) { }

    loadUsers(): void {
        this.http.get<IUser[]>(this.apiUrl).subscribe(users => {
            this.usersSubject.next(users);
        });
    }

    searchUsers(query: string): Observable<IUser[]> {
        return this.http.get<IUser[]>(`${this.apiUrl}?q=${query}`);
    }

    filterUsers(query: string): void {
        if (!query) {
            this.loadUsers();
            return;
        }
        this.http.get<IUser[]>(`${this.apiUrl}?q=${query}`).subscribe(users => {
            this.usersSubject.next(users);
        });
    }

    createUser(user: Omit<IUser, 'id'>): Observable<IUser> {
        return this.http.post<IUser>(this.apiUrl, user).pipe(
            tap(createdUser => {
                const currentUsers = this.usersSubject.value;
                this.usersSubject.next([...currentUsers, createdUser]);
            })
        );
    }

    updateUser(user: IUser): Observable<IUser> {
        return this.http.put<IUser>(`${this.apiUrl}/${user.id}`, user).pipe(
            tap(updatedUser => {
                const currentUsers = this.usersSubject.value;
                const index = currentUsers.findIndex(u => u.id === updatedUser.id);
                if (index !== -1) {
                    const updatedUsers = [...currentUsers];
                    updatedUsers[index] = updatedUser;
                    this.usersSubject.next(updatedUsers);
                }
            })
        );
    }

    deleteUser(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            tap(() => {
                const currentUsers = this.usersSubject.value;
                this.usersSubject.next(currentUsers.filter(u => u.id !== id));
            })
        );
    }
}
