import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../core/auth';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  registerForm!: FormGroup;
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  submitted = false;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (form.get('confirmPassword')?.hasError('passwordMismatch')) {
      form.get('confirmPassword')?.setErrors(null);
    }

    return null;
  }

  shouldShowError(controlName: string): boolean {
    const control = this.registerForm.get(controlName);

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

    const controls = Object.values(this.registerForm.controls);
    for (const control of controls) {
      control.markAsTouched();
      control.markAsDirty();
    }

    if (this.registerForm.invalid) {
      this.scrollToFirstError();
      return;
    }

    this.loading = true;
    const { confirmPassword, ...registerData } = this.registerForm.value;

    this.auth.register(registerData).subscribe({
      next: () => {
        this.snackBar.open('Регистрация прошла успешно!', 'OK', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Ошибка регистрации', 'OK', {
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