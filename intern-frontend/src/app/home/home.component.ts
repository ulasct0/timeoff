import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HomeService} from './service/home.service';
import {NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Timeoff} from '../timeoff/model/timeoff.model';
import {AuthService} from '../credentials/service/auth.service';

@Component({
  selector: 'app-home',
  imports: [
    NgIf,
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  @ViewChild('requestModal') requestModalRef!: ElementRef;

  positionByEmployeeId?: string;
  totalEmployees = 0;
  totalTimeoffs = 0;
  remainingTimeoff = 0;
  newTimeoff: Timeoff = {
    id: 0,
    employeeId: 1, // or get from session
    startDate: new Date(),
    endDate: new Date(),
    typeId: 1, // default or based on your logic
    status: 'pending',
    reason: '',
    isEarned: false,
  };
  employeeId: number = 0;

  constructor(private homeService: HomeService,
              private auth: AuthService) {
  }

  ngOnInit() {
    this.employeeId = this.auth.getEmployeeId() ?? 0;
    if (this.auth.isLoggedIn() === false) {
      this.auth.logout();
    }
    this.loadPositionByEmployeeId(this.employeeId);
  }

  loadPositionByEmployeeId(employeeId: number) {
    this.homeService.getPositionByEmployeeId(employeeId).subscribe((data: string) => {
      this.positionByEmployeeId = data;
      this.loadCounts();
    })
  }

  onSubmitTimeoff(value: any) {

  }

  private loadCounts() {
    if (this.positionByEmployeeId === 'AD' || this.positionByEmployeeId === 'HR') {
      // only for admins / HR, fetch counts
      this.homeService.getAllEmployeesCount()
        .subscribe(count => this.totalEmployees = count);
      this.homeService.getAllTimeoffsCount()
        .subscribe(count => this.totalTimeoffs = count);
    } else if (this.positionByEmployeeId === 'EM') {
      // for regular employees, fetch remaining leave
      this.homeService.getRemainingTimeoffByEmployeeId(this.employeeId)
        .subscribe(data => this.remainingTimeoff = data);
    }
  }
}
