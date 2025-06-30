import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthService {
  private authUrl = '/api';

  constructor(private _httpClient: HttpClient,
              private router: Router) {
  }

  login(email: string, password: string) {
    return this._httpClient.post<number>(
      `${this.authUrl}/login`,
      {email, password}
    );
  }

  logout() {
    this.router.navigate(['/login'])
      .then(() => sessionStorage.removeItem('employeeId'))
      .then(() => window.location.reload());
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('employeeId');
  }

  setLoggedIn(employeeId: number) {
    sessionStorage.setItem('employeeId', employeeId.toString());
    sessionStorage.removeItem('saved-login-form');
    this.router.navigate(['/dashboard'])
      .then(() => window.location.reload());
  }

  getEmployeeId(): number | null {
    const employeeId = sessionStorage.getItem('employeeId');
    return employeeId ? Number(employeeId) : null;
  }
}
