import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(private _httpClient: HttpClient) { }

  private readonly employeeUrl: string = 'http://localhost:8085/api/v1/employees';
  private readonly timeoffUrl: string = 'http://localhost:8085/api/v1/timeoffs';

  getPositionByEmployeeId(employeeId: number): Observable<string> {
    return this._httpClient.get(
      `${this.employeeUrl}/position/${employeeId}`,
      { responseType: 'text' }
    );
  }

  getAllEmployeesCount(): Observable<number> {
    return this._httpClient.get<number>(`${this.employeeUrl}/stats/count`);
  }

  getAllTimeoffsCount(): Observable<number> {
    return this._httpClient.get<number>(`${this.timeoffUrl}/count`);
  }

  getRemainingTimeoffByEmployeeId(id: number): Observable<number> {
    return this._httpClient.get<number>(`${this.timeoffUrl}/employee/remaining/${id}`);
  }
}
