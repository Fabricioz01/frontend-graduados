import { AuthenticationService } from '@/app/services/auth.service'
import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import { RouterLink } from '@angular/router'
import { currentYear } from '@common/constants'
import { Store } from '@ngrx/store'
import { login } from '@store/authentication/authentication.actions'
import { getError } from '@store/authentication/authentication.selector'

@Component({
    selector: 'app-sign-in',
    imports: [FormsModule, ReactiveFormsModule, RouterLink, CommonModule],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  currentYear = currentYear
  signInForm!: UntypedFormGroup
  submitted: boolean = false

  errorMessage: string = ''

  public fb = inject(UntypedFormBuilder)
  public store = inject(Store)
  public service = inject(AuthenticationService)

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: ['user@demo.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required]],
    })
  }

  get formValues() {
    return this.signInForm.controls
  }

  login() {
    this.submitted = true
    if (this.signInForm.valid) {
      const email = this.formValues['email'].value // Get the username from the form
      const password = this.formValues['password'].value // Get the password from the form

      // Login Api
      this.store.dispatch(login({ email: email, password: password }))

      this.store.select(getError).subscribe((data) => {
        if (data) {
          this.errorMessage = data.error.message

          setTimeout(() => {
            this.errorMessage = ''
          }, 3000)
        }
      })
    }
  }
}
