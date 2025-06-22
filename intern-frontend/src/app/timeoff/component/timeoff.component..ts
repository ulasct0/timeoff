import {Component, OnInit} from '@angular/core';import {Employee} from '../../employee-list/model/employee.model';
import {EmployeeListService} from '../../employee-list/service/employee-list.service';
import {NgForOf, NgIf} from '@angular/common';
import {TimeoffEmployeeComponent} from './timeoff-employee/component/timeoff-employee.component';
import {
  TimeoffEmployeeTimeoffsComponent
} from './timeoff-employee-timeoffs/component/timeoff-employee-timeoffs.component';


@Component({
  selector: 'app-timeoff',
  imports: [
    NgForOf,
    TimeoffEmployeeComponent,
    NgIf,
    TimeoffEmployeeTimeoffsComponent
  ],
  templateUrl: './timeoff.component..html',
  styleUrl: './timeoff.component..css'
})
export class TimeoffComponent implements OnInit {
  employees: Employee[] = [];
  selectedUserId?: number;

  constructor(private employeeListService: EmployeeListService) {
  }

  get selectedUser() {
    return this.employees.find((employee: { id: number | undefined; }) => employee.id === this.selectedUserId);
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeListService.fetchAllEmployees().subscribe(data => {
      this.employees = data;
    });
  }

  trackByUserId(index: number, employee: Employee): number {
    return employee.id;  // unique key for each user
  }

  onSelectUser(id: number) {
    this.selectedUserId = id;
  }
}
