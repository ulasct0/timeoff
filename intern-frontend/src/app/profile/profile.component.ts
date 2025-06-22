import {Component, OnInit} from '@angular/core';
import {ProfileService} from './service/profile.service';
import {Employee} from '../employee-list/model/employee.model';
import {Timeoff} from '../timeoff/model/timeoff.model';
import {NgForOf} from '@angular/common';

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

  timeoffs: Timeoff[] = [];

  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    this.loadTimeoffsByEmployeeId();
    this.loadEmployeeById();
  }

  loadTimeoffsByEmployeeId() {
    this.profileService.fetchTimeoffsByEmployeeId(1).subscribe((data: Timeoff[]) => {
      this.timeoffs = data;
    })
  }

  loadEmployeeById() {
    this.profileService.fetchEmployeeById(1).subscribe((data: Employee) => {
      this.employee = data;
    })
  }
}
