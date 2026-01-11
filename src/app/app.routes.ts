import { Routes } from '@angular/router';
import { UsersContainerComponent } from './features/users/users-container.component';

export const routes: Routes = [
    { path: '', component: UsersContainerComponent },
    { path: '**', redirectTo: '' }
];
