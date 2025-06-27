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
      .then(r => sessionStorage.removeItem('employeeId'));
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('employeeId');
  }

  setLoggedIn(employeeId: number) {
    sessionStorage.setItem('employeeId', employeeId.toString());
    sessionStorage.removeItem('saved-login-form');
    this.router.navigate(['/dashboard']);
  }

  getEmployeeId(): number | null {
    const employeeId = sessionStorage.getItem('employeeId');
    return employeeId ? Number(employeeId) : null;
  }
}
