import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Employee} from '../../employee-list/model/employee.model';
import {Timeoff} from '../../timeoff-list/model/timeoff.model';

@Injectable({
  providedIn: 'root',
})

export class ProfileService {
  private employeeUrl: string = '/api/v1/employees';
  private timeoffUrl: string = '/api/v1/timeoffs';

  constructor(private _httpClient: HttpClient) {
  }

  fetchEmployeeById(id: number): Observable<Employee> {
    return this._httpClient.get<Employee>(`${this.employeeUrl}/${id}`);
  }

  fetchTimeoffsByEmployeeId(employeeId: number): Observable<Timeoff[]> {
    return this._httpClient.get<Timeoff[]>(`${this.timeoffUrl}/employee/allTimeoffs/${employeeId}`);
  }
}
