import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../core/auth';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  loginForm!: FormGroup;
  loading = false;
  hidePassword = true;
  submitted = false;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      remember: [true]
    });
  }

  shouldShowError(controlName: string): boolean {
    const control = this.loginForm.get(controlName);

    if (this.submitted) {
      return control?.invalid || false;
    }

    if (control?.touched && control?.dirty) {
      if (control?.hasError('required')) {
        return false;
      }
      return control?.invalid || false;
    }

    return false;
  }

  onSubmit(): void {
    this.submitted = true;

    for (const control of Object.values(this.loginForm.controls)) {
      control.markAsTouched();
      control.markAsDirty();
    }

    if (this.loginForm.invalid) {
      this.scrollToFirstError();
      return;
    }

    this.loading = true;
    const { remember, ...loginData } = this.loginForm.value;

    this.auth.login(loginData).subscribe({
      next: () => {
        this.snackBar.open('Вход в аккаунт произошел успешно!', 'OK', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Ошибка аутентификации', 'OK', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private scrollToFirstError(): void {
    const firstErrorElement = document.querySelector('.form-error:not(:empty)');
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }
}