// src/app/services/timeoff.service.ts

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Timeoff} from '../model/timeoff.model';

@Injectable({
  providedIn: 'root',
})
export class TimeoffService {
  private timeoffUrl: string = '/api/v1/timeoffs';

  constructor(private http: HttpClient) {
  }

  fetchAllTimeoffs(): Observable<Timeoff[]> {
    return this.http.get<Timeoff[]>(`${this.timeoffUrl}`);
  }

  getAllTimeoffsByEmployeeId(employeeId: number): Observable<Timeoff[]> {
    return this.http.get<Timeoff[]>(`${this.timeoffUrl}/employee/${employeeId}`);
  }

  createTimeoff(data: Timeoff): Observable<Timeoff> {
    return this.http.post<Timeoff>(`${this.timeoffUrl}`, data);
  }


  updateTimeoff(data: Timeoff): Observable<Timeoff> {
    return this.http.put<Timeoff>(`${this.timeoffUrl}/${data.id}`, data);
  }


  deleteTimeoff(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.timeoffUrl}/${id}`);
  }

  changeTimeoffStatus(id: number): Observable<Timeoff> {
    return this.http.get<Timeoff>(`${this.timeoffUrl}/changeTimeoffStatus/${id}`);
  }

  getPendingTimeoffs(): Observable<Timeoff[]> {
    return this.http.get<Timeoff[]>(`${this.timeoffUrl}/pendingTimeoffs`);
  }

  countPendingTimeoffs(): Observable<number> {
    return this.http.get<number>(`${this.timeoffUrl}/countPendingTimeoffs`);
  }

  getTodayAndApprovedTimeoffs(): Observable<Timeoff[]> {
    return this.http.get<Timeoff[]>(`${this.timeoffUrl}/todayAndApprovedTimeoffs`);
  }

  countTodayAndApprovedTimeoffs(): Observable<number> {
    return this.http.get<number>(`${this.timeoffUrl}/countTodayAndApprovedTimeoffs`);
  }

  getAllTimeoffsByEmployeeIdWithFullName(employeeId: number): Observable<Timeoff[]> {
    return this.http.get<Timeoff[]>(`${this.timeoffUrl}/withFullName/${employeeId}`);
  }

  getAllTimeoffsWithFullName(): Observable<Timeoff[]> {
    return this.http.get<Timeoff[]>(`${this.timeoffUrl}/withFullName`);
  }

  countAllTimeoffsByEmployeeId(employeeId: number): Observable<number> {
    return this.http.get<number>(`${this.timeoffUrl}/count/${employeeId}`);
  }

  countAllTimeoffs(): Observable<number> {
    return this.http.get<number>(`${this.timeoffUrl}/count`);
  }
}
