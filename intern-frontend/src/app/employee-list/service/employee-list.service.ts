import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Employee} from '../model/employee.model';
import {Timeoff} from '../../timeoff/model/timeoff.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeListService {
  private baseUrl: String = 'http://localhost:8085/api/v1/employees';

  constructor(private _httpClient: HttpClient) {
  }

  fetchAllEmployees(): Observable<Employee[]> {
    return this._httpClient.get<Employee[]>(`${this.baseUrl}`);
  }

  createEmployee(data: Employee): Observable<Employee> {
    return this._httpClient.post<Employee>(`${this.baseUrl}`, data);
  }

  updateEmployee(data: Employee): Observable<Employee> {
    return this._httpClient.put<Employee>(`${this.baseUrl}/${data.id}`, data);
  }

  deleteEmployee(id: number) {
    return this._httpClient.delete<Employee>(`${this.baseUrl}/${id}`);
  }

  fetchEmployeeById(id: number): Observable<Employee> {
    return this._httpClient.get<Employee>(`${this.baseUrl}/${id}`);
  }
}
