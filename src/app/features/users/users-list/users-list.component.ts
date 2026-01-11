import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IUser } from '@app/core/models/user.model';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent {
  @Input() users: IUser[] = [];
  @Output() edit = new EventEmitter<IUser>();
  @Output() delete = new EventEmitter<string>();

  trackByFn(index: number, user: IUser): string {
    return user.id;
  }
}
