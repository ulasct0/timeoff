// src/app/credentials/login/login.component.ts
import {Component} from '@angular/core';
import {CommonModule, NgIf} from '@angular/common';
import {ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormsModule} from '@angular/forms';
import {AuthService} from '../service/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,         // for NgIf, *ngIf in template
    NgIf,
    ReactiveFormsModule,
    // for formGroup, formControlName
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    const {email, password} = this.loginForm.value;
    this.auth.login(email, password).subscribe(id => {
      if (id > 0) {
        sessionStorage.setItem('employeeId', id.toString());
        // ← use the ‘home’ route you defined in app.routes.ts
        this.router.navigate(['/home']);
      } else {
        this.errorMsg = 'Invalid email or password.';
      }
    }, err => {
      console.error(err);
      this.errorMsg = 'Login failed. Please try again.';
    });
  }
}
