import { Component, DestroyRef, inject, OnInit } from '@angular/core'
import { Validators, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { NgIf } from '@angular/common'
import { Errors } from '../../shared/models/errors.model'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { AuthService } from '../../services/auth/auth.service'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatInputModule } from '@angular/material/input'
import { MatStepperModule } from '@angular/material/stepper'

interface AuthForm {
  email: FormControl<string>
  password: FormControl<string>
  username?: FormControl<string>
}

interface StoreForm {
  storeName?: FormControl<string>
}

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  imports: [
    RouterLink,
    NgIf,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatStepperModule
  ],
  standalone: true
})
export default class AuthComponent implements OnInit {
  authType = ''
  title = ''
  errors: Errors = { errors: {} }
  isSubmitting = false
  authForm: FormGroup<AuthForm>
  destroyRef = inject(DestroyRef)
  userInfoForm: FormGroup<AuthForm>
  storeInfoForm: FormGroup<StoreForm>

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: AuthService
  ) {
    this.authForm = new FormGroup<AuthForm>({
      email: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      }),
      password: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      })
    })

    this.userInfoForm = new FormGroup<AuthForm>({
      username: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      }),
      email: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      }),
      password: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      })
    })

    this.storeInfoForm = new FormGroup<StoreForm>({
      storeName: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      })
    })
  }

  ngOnInit(): void {
    this.authType = this.route.snapshot.url.at(-1)!.path
    this.title = this.authType === 'login' ? 'Sign in' : 'Sign up'
    if (this.authType === 'register') {
      this.authForm.addControl(
        'username',
        new FormControl('', {
          validators: [Validators.required],
          nonNullable: true
        })
      )
    }
  }

  submitForm(): void {
    this.isSubmitting = true
    this.errors = { errors: {} }

    let observable =
      this.authType === 'login'
        ? this.userService.logIn(this.authForm.value as { email: string; password: string })
        : this.userService.signUp({
            email: this.userInfoForm.value.email || '',
            password: this.userInfoForm.value.password || '',
            username: this.userInfoForm.value.username || '',
            storeName: this.storeInfoForm.value.storeName || ''
          })

    observable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => void this.router.navigate(['/']),
      error: (err) => {
        this.errors = err
        this.isSubmitting = false
      }
    })
  }
}
