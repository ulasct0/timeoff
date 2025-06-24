// src/app/services/timeoff.service.ts

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Timeoff} from '../model/timeoff.model';

@Injectable({
  providedIn: 'root',
})
export class TimeoffService {
  private baseUrl: string = 'http://localhost:8085/api/v1/timeoffs';

  constructor(private http: HttpClient) {
  }


  fetchAllTimeoffs(): Observable<Timeoff[]> {
    return this.http.get<Timeoff[]>(`${this.baseUrl}`);
  }

  getAllTimeoffsByEmployeeId(employeeId: number): Observable<Timeoff[]> {
    return this.http.get<Timeoff[]>(`${this.baseUrl}/employee/${employeeId}`);
  }

  createTimeoff(data: Timeoff): Observable<Timeoff> {
    return this.http.post<Timeoff>(`${this.baseUrl}`, data);
  }


  updateTimeoff(data: Timeoff): Observable<Timeoff> {
    return this.http.put<Timeoff>(`${this.baseUrl}/${data.id}`, data);
  }


  deleteTimeoff(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }

  changeTimeoffStatus(id: number): Observable<Timeoff> {
    return this.http.get<Timeoff>(`${this.baseUrl}/changeTimeoffStatus/${id}`);
  }

}
