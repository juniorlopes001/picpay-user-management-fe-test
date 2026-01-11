import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged } from 'rxjs';

import { UsersService } from '@app/core/services/users.service';
import { IUser } from '@app/core/models/user.model';
import { UsersListComponent } from './users-list/users-list.component';
import { UserFormComponent } from './user-form/user-form.component';

@Component({
  selector: 'app-users-container',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UsersListComponent, UserFormComponent],
  templateUrl: './users-container.component.html',
  styleUrls: ['./users-container.component.scss']
})
export class UsersContainerComponent implements OnInit {
  private usersService = inject(UsersService);

  users$: Observable<IUser[]> = this.usersService.users$;
  searchControl = new FormControl('');

  showForm = false;
  selectedUser: IUser | null = null;

  ngOnInit(): void {
    this.usersService.loadUsers();

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.usersService.filterUsers(query || '');
    });
  }

  openCreateForm(): void {
    this.selectedUser = null;
    this.showForm = true;
  }

  onEdit(user: IUser): void {
    this.selectedUser = user;
    this.showForm = true;
  }

  onDelete(id: string): void {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.usersService.deleteUser(id).subscribe();
    }
  }

  onSave(user: IUser | Omit<IUser, 'id'>): void {
    if ('id' in user && user.id) {
      this.usersService.updateUser(user as IUser).subscribe(() => {
        this.showForm = false;
        this.selectedUser = null;
      });
    } else {
      this.usersService.createUser(user as Omit<IUser, 'id'>).subscribe(() => {
        this.showForm = false;
      });
    }
  }

  onCancel(): void {
    this.showForm = false;
    this.selectedUser = null;
  }
}
