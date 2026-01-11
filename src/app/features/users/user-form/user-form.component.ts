import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUser } from '@app/core/models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnChanges {
  @Input() user: IUser | null = null;
  @Output() save = new EventEmitter<Omit<IUser, 'id'> | IUser>();
  @Output() cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    id: [''],
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]]
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user) {
      this.form.patchValue(this.user);
    } else {
      this.form.reset();
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      if (!formValue.id) {
        const { id, ...newUser } = formValue;
        this.save.emit(newUser);
      } else {
        this.save.emit(formValue);
      }
      this.form.reset();
    }
  }
}
