import {Component, DestroyRef, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigationEnd, Router, RouterEvent, RouterModule} from '@angular/router';
import {AuthService} from '../../login/service/auth.service';
import {DashboardService} from '../../dashboard/service/dashboard.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {filter} from 'rxjs';

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
  showThreeNavbar: boolean = false;

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private destroyRef: DestroyRef,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.employeeId = this.authService.getEmployeeId() ?? 0;
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const atRoot = event.urlAfterRedirects === '/';
        const noEmp = this.employeeId === 0;
        this.showThreeNavbar = atRoot || noEmp;
      })

    this.dashboardService.getPositionByEmployeeId(this.employeeId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(pos => this.employeePositionByEmployeeId = pos);
  }

  logout() {
    this.authService.logout();
  }
}
