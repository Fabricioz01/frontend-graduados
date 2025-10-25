import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { currentYear } from '@shared/constants/app.constants';
import { Store } from '@ngrx/store';
import { login } from '@core/store/authentication/authentication.actions';
import { getError } from '@core/store/authentication/authentication.selector';
import { AuthenticationService } from '@core/services/api/auth.service';

@Component({
  selector: 'app-sign-in',
  imports: [FormsModule, ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  currentYear = currentYear;
  signInForm!: UntypedFormGroup;
  submitted: boolean = false;

  errorMessage: string = '';

  public fb = inject(UntypedFormBuilder);
  public store = inject(Store);
  public service = inject(AuthenticationService);

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: ['user@demo.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required]],
    });
  }

  get formValues() {
    return this.signInForm.controls;
  }

  login() {
    this.submitted = true;
    if (this.signInForm.valid) {
      // ⚠️ DESARROLLO: Login desactivado temporalmente para testing
      // Redirige directamente al dashboard sin autenticación

      console.log('🔧 Modo desarrollo: Login bypass activado');
      console.log('📧 Email:', this.formValues['email'].value);
      console.log('🔑 Password:', this.formValues['password'].value);

      // Simular que el login fue exitoso y redirigir
      window.location.href = '/dashboard/index';

      // TODO: Descomentar cuando conectes el backend real
      /*
      const email = this.formValues['email'].value;
      const password = this.formValues['password'].value;

      // Login Api
      this.store.dispatch(login({ email: email, password: password }));

      this.store.select(getError).subscribe((data) => {
        if (data) {
          // Manejo seguro de errores con verificación de estructura
          this.errorMessage = data?.error?.message || data?.message || 'Error de conexión con el servidor';

          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      });
      */
    }
  }
}
