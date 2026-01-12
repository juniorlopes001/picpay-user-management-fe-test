import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@app/core/services/auth.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, CardModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);

    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
    });

    errorMessage: string = '';
    isLoading: boolean = false;

    onSubmit(): void {
        if (this.loginForm.valid) {
            this.isLoading = true;
            this.errorMessage = '';
            const { email, password } = this.loginForm.value;

            this.authService.login(email!, password!)
                .subscribe({
                    next: (success) => {
                        this.isLoading = false;
                        if (!success) {
                            this.errorMessage = 'Email ou senha inválidos';
                        }
                    },
                    error: () => {
                        this.isLoading = false;
                        this.errorMessage = 'Erro ao tentar realizar login';
                    }
                });
        }
    }
}
