import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.services';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

    passwordInputType: 'password' | 'text' = 'password';

    loginForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
    ) {
        this.loginForm = this.formBuilder.group({
            email: ['',[Validators.required,Validators.email]],
            password: ['',[Validators.required]],
        });
    }

    togglePasswordInputType(): void {
        this.passwordInputType = (this.passwordInputType == 'password') ? 'text' : 'password';
    }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
        } else {
            this.authService.login(this.loginForm.value).subscribe({
                next: (result) => {
                    this.router.navigate(['dashboard','home']);
                },
                error: (err) => {
                    console.error(err);
                    if (err instanceof Error)
                        alert(err.message);

                    if (err instanceof HttpErrorResponse) {
                        if (err.status === 0)
                            alert('No se pudo conectar con el servidor')
                    }
                },
            })
        }
    }
}
