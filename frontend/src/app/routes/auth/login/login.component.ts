import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Route, ActivatedRoute, RouterLink, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { UserService } from '../../../services/user/user.service';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Errors } from '../../../shared/models/errors.model';

@Component({
  standalone: true,
  selector: 'auth-page',
  templateUrl: './login.component.html',
  styleUrl: './login.component.less',
  imports: [ReactiveFormsModule, RouterLink, CommonModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatCardModule]
})
export class LoginComponent implements OnInit {
  errors: Errors = { errors: {} };
  authType: String = '';
  title: String = '';
  isSubmitting: boolean = false;
  authForm: FormGroup;
  destroyRef = inject(DestroyRef);


  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    // use FormBuilder to create a form group
    this.authForm = this.fb.group({
      'email': ['', Validators.required],
      'password': ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.url.subscribe(data => {
      // Get the last piece of the URL (it's either 'login' or 'register')
      this.authType = data[data.length - 1].path;
      // Set a title for the page accordingly
      this.title = (this.authType === 'login') ? 'Sign In' : 'Sign Up';
      // add form control for username if this is the register page
      if (this.authType === 'register') {
        this.authForm.addControl('username', new FormControl('', Validators.required));
        this.authForm.addControl('store', new FormControl('', Validators.required))
      }
    });
  }

  submitForm() {
    this.isSubmitting = true;

    let credentials = this.authForm.value;
    // check out what you get!
  //  this._feathers.authenticate(credentials).then(data => {
  //   console.log(data)
  //  })

  let observable = this.userService.login(credentials)

  observable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
    next: () => void this.router.navigate(["/"]),
    error: (err) => {
      this.errors = err;
      this.isSubmitting = false;
    },
  });    console.log(credentials);
  }
}

export const authRouting: Route [] = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: LoginComponent
  }
];