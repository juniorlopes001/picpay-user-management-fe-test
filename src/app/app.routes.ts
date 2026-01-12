import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: 'users',
        loadChildren: () => import('./features/users/users.routes').then(m => m.USER_ROUTES),
        canActivate: [authGuard]
    },
    { path: '', redirectTo: 'users', pathMatch: 'full' },
    { path: '**', redirectTo: 'users' }
];
