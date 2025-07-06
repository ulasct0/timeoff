import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Leave} from '../model/leave.model';
import {LeaveWithFullName} from '../dto/LeaveWithFullName.dto';
import {Position} from '../../employee-list/dto/Position.dto';

@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  private leaveUrl: string = '/api/v1/leaves';
  private employeeUrl: string = '/api/v1/employees';

  constructor(private http: HttpClient) {
  }

  fetchAllLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.leaveUrl}`);
  }

  getAllLeavesByEmployeeId(employeeId: number): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.leaveUrl}/employee/${employeeId}`);
  }

  createLeave(data: Leave): Observable<Leave> {
    return this.http.post<Leave>(`${this.leaveUrl}`, data);
  }


  updateLeave(data: Leave): Observable<Leave> {
    return this.http.put<Leave>(`${this.leaveUrl}/${data.id}`, data);
  }


  deleteLeave(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.leaveUrl}/${id}`);
  }

  changeLeaveStatus(id: number): Observable<Leave> {
    return this.http.get<Leave>(`${this.leaveUrl}/changeLeaveStatus/${id}`);
  }

  getPendingLeaves(): Observable<LeaveWithFullName[]> {
    return this.http.get<LeaveWithFullName[]>(`${this.leaveUrl}/pendingLeaves`);
  }

  countPendingLeaves(): Observable<number> {
    return this.http.get<number>(`${this.leaveUrl}/countPendingLeaves`);
  }

  getTodayAndApprovedLeaves(): Observable<LeaveWithFullName[]> {
    return this.http.get<LeaveWithFullName[]>(`${this.leaveUrl}/todayAndApprovedLeaves`);
  }

  countTodayAndApprovedLeaves(): Observable<number> {
    return this.http.get<number>(`${this.leaveUrl}/countTodayAndApprovedLeaves`);
  }

  getAllLeavesByEmployeeIdWithFullName(employeeId: number): Observable<LeaveWithFullName[]> {
    return this.http.get<LeaveWithFullName[]>(`${this.leaveUrl}/withFullName/${employeeId}`);
  }

  getAllLeavesWithFullName(): Observable<LeaveWithFullName[]> {
    return this.http.get<LeaveWithFullName[]>(`${this.leaveUrl}/withFullName`);
  }

  countAllLeavesByEmployeeId(employeeId: number): Observable<number> {
    return this.http.get<number>(`${this.leaveUrl}/count/${employeeId}`);
  }

  countAllLeaves(): Observable<number> {
    return this.http.get<number>(`${this.leaveUrl}/count`);
  }

  changeEmployeePositionByEmployeeId(employeeId: number, position: Position): Observable<boolean> {
    return this.http.put<boolean>(`${this.employeeUrl}/changeEmployeePosition/${employeeId}/${position}`, {});
  }

}
