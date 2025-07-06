import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GenderCountDTO} from '../dto/gender-count.dto';
import {PositionCountDTO} from '../dto/position-count.dto';
import {Position} from '../../employee-list/dto/Position.dto';

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

  getPositionByEmployeeId(employeeId: number): Observable<Position> {
    return this._httpClient.get<Position>(
      `${this.employeeUrl}/position/${employeeId}`
    );
  }

  getAllEmployeesCount(): Observable<number> {
    return this._httpClient.get<number>(`${this.employeeUrl}/stats/count`);
  }

  getAllTimeoffsCount(): Observable<number> {
    return this._httpClient.get<number>(`${this.timeoffUrl}/count`);
  }

  getGenderCounts(): Observable<GenderCountDTO[]> {
    return this._httpClient.get<GenderCountDTO[]>(`${this.employeeUrl}/gender-counts`);
  }

  getPositionCounts(): Observable<PositionCountDTO[]> {
    return this._httpClient.get<PositionCountDTO[]>(`${this.employeeUrl}/position-counts`);
  }
}
