import {Component, DestroyRef, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {AuthService} from '../../login/service/auth.service';
import {EmployeeListService} from '../../employee-list/service/employee-list.service';
import {DashboardService} from '../../dashboard/service/dashboard.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterModule,
  ],
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  employeeId: number = 0;
  employeePositionByEmployeeId: string = '';

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private destroyRef: DestroyRef
  ) {
  }

  ngOnInit() {
    this.employeeId = this.authService.getEmployeeId() ?? 0;

    this.dashboardService.getPositionByEmployeeId(this.employeeId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(pos => this.employeePositionByEmployeeId = pos);
  }

  logout() {
    this.authService.logout();
  }
}
