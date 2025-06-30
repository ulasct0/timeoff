// src/app/credentials/login/login.component.ts
import {Component, DestroyRef, OnInit} from '@angular/core';
import {
  FormGroup,
  FormsModule,
  FormControl, ReactiveFormsModule, Validators, FormBuilder
} from '@angular/forms';
import {NgIf} from '@angular/common';
import {debounceTime} from 'rxjs';
import {AuthService} from '../service/auth.service';
import {Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  emailControl!: FormControl;
  passwordControl!: FormControl;

  errorMessage = '';
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private destroyRef: DestroyRef,
    private authService: AuthService,
    private router: Router
  ) {
  }


  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }

    this.loginForm = this.formBuilder.group({
      email: new FormControl('', {
        validators: [Validators.email, Validators.required, Validators.maxLength(50)],
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6), Validators.maxLength(50)],
      })
    });
    this.emailControl = this.loginForm.controls['email'] as FormControl;
    this.passwordControl = this.loginForm.controls['password'] as FormControl;
    const savedForm = window.sessionStorage.getItem('saved-login-form');

    if (savedForm) {
      const loadedForm = JSON.parse(savedForm);
      this.loginForm.patchValue({
        email: loadedForm.email,
      });
    }


    const subscription = this.loginForm.valueChanges.pipe(debounceTime(500))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: (value) => {
        console.log(value);
        window.sessionStorage.setItem('saved-login-form', JSON.stringify({email: value.email}));
      }
    })
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.errorMessage = this.errorMessageHandler();
    }

    if (this.loginForm.valid) {
      this.authService.login(this.emailControl.value, this.passwordControl.value).subscribe({
        next: (data) => {
          if (data === -1) {
            this.errorMessage = "Invalid email or password.";
          } else {
            this.authService.setLoggedIn(data);
          }
        }
      })
    }
  }

  private errorMessageHandler(): string {

    if (this.emailControl.hasError('required')) {
      return "Please fill in your email address.";
    } else if (this.emailControl.hasError('email')) {
      return 'Please enter a valid email.';
    } else if (this.emailControl.hasError('maxlength')) {
      return 'Please enter a valid email.';
    } else if (this.passwordControl.hasError('required')) {
      return "Please fill in your password.";
    }

    return '';
  }
}
