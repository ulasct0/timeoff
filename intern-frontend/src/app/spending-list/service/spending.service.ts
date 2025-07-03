import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Spending} from '../model/spending.model';

@Injectable({
  providedIn: 'root',
})
export class SpendingService {
  private spendingUrl: string = '/api/v1/spendings';

  constructor(private http: HttpClient) {
  }

  getAllSpendings(): Observable<Spending[]> {
    return this.http.get<Spending[]>(`${this.spendingUrl}`);
  }

  getAllSpendingsByEmployeeId(employeeId: number): Observable<Spending[]> {
    return this.http.get<Spending[]>(`${this.spendingUrl}/employee/${employeeId}`);
  }

  createSpending(data: Spending): Observable<Spending> {
    return this.http.post<Spending>(`${this.spendingUrl}`, data);
  }


  updateSpending(data: Spending): Observable<Spending> {
    return this.http.put<Spending>(`${this.spendingUrl}/${data.id}`, data);
  }


  deleteSpending(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.spendingUrl}/${id}`);
  }

  changeSpendingStatus(id: number): Observable<Spending> {
    return this.http.get<Spending>(`${this.spendingUrl}/changeSpendingStatus/${id}`);
  }

  getPendingSpendings(): Observable<Spending[]> {
    return this.http.get<Spending[]>(`${this.spendingUrl}/pendingSpendings`);
  }

  countPendingSpendings(): Observable<number> {
    return this.http.get<number>(`${this.spendingUrl}/countPendingSpendings`);
  }

  getTodayAndApprovedSpendings(): Observable<Spending[]> {
    return this.http.get<Spending[]>(`${this.spendingUrl}/todayAndApprovedSpendings`);
  }

  countTodayAndApprovedSpendings(): Observable<number> {
    return this.http.get<number>(`${this.spendingUrl}/countTodayAndApprovedSpendings`);
  }

  countAllSpendingsByEmployeeId(employeeId: number): Observable<number> {
    return this.http.get<number>(`${this.spendingUrl}/count/${employeeId}`);
  }

  countAllSpendings(): Observable<number> {
    return this.http.get<number>(`${this.spendingUrl}/count`);
  }
}
