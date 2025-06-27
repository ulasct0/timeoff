import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly timeoffUrl = '/api/v1/timeoffs';
  private readonly employeeUrl = '/api/v1/employees';

  constructor(private _httpClient: HttpClient) {
  }
  
  countUsedTimeoffsByEmployeeId(employeeId: number): Observable<number> {
    return this._httpClient.get<number>(`${this.timeoffUrl}/employee/used/${employeeId}`);
  }

  getRemainingTimeoffByEmployeeId(employeeId: number): Observable<number> {
    return this._httpClient.get<number>(`${this.timeoffUrl}/employee/remaining/${employeeId}`);
  }

  getPositionByEmployeeId(employeeId: number): Observable<string> {
    return this._httpClient.get(
      `${this.employeeUrl}/position/${employeeId}`,
      {responseType: 'text'}
    );
  }

  getAllEmployeesCount(): Observable<number> {
    return this._httpClient.get<number>(`${this.employeeUrl}/stats/count`);
  }

  getAllTimeoffsCount(): Observable<number> {
    return this._httpClient.get<number>(`${this.timeoffUrl}/count`);
  }
}
