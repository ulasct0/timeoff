import {Component, OnInit} from '@angular/core';
import {ProfileService} from './service/profile.service';
import {Employee} from '../employee-list/model/employee.model';
import {Timeoff} from '../timeoff/model/timeoff.model';
import {NgForOf} from '@angular/common';
import {AuthService} from '../credentials/service/auth.service';

@Component({
  selector: 'app-profile',
  imports: [
    NgForOf
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  employee: Employee | undefined;
  employeeId: number = 0;
  timeoffs: Timeoff[] = [];

  constructor(private profileService: ProfileService,
              private auth: AuthService) {
  }

  ngOnInit() {
    this.employeeId = this.auth.getEmployeeId() ?? 0;
    if (this.auth.isLoggedIn() === false) {
      this.auth.logout();
    }
    this.loadTimeoffsByEmployeeId();
    this.loadEmployeeById();
  }

  loadTimeoffsByEmployeeId() {
    this.profileService.fetchTimeoffsByEmployeeId(this.employeeId).subscribe((data: Timeoff[]) => {
      this.timeoffs = data;
    })
  }

  loadEmployeeById() {
    this.profileService.fetchEmployeeById(this.employeeId).subscribe((data: Employee) => {
      this.employee = data;
    })
  }
}
