// src/app/services/auth.service.ts
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthService {
  private authUrl = '/api';

  constructor(private http: HttpClient,
              private router: Router) {
  }

  login(email: string, password: string): Observable<number> {
    return this.http.post<number>(
      `${this.authUrl}/login`,
      {email, password}
    );
  }

  logout() {
    // remove the stored employeeId
    sessionStorage.removeItem('employeeId');
    // navigate back to login
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('employeeId');
  }

  getEmployeeId(): number | null {
    const raw = sessionStorage.getItem('employeeId');
    return raw ? Number(raw) : null;
  }
}
