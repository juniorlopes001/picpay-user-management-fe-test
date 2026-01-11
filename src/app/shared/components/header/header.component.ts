import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@app/core/services/auth.service';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, ButtonModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    authService = inject(AuthService);

    logout(): void {
        this.authService.logout();
    }
}
