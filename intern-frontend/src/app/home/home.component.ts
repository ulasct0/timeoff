import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HomeService} from './service/home.service';
import {NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Timeoff} from '../timeoff/model/timeoff.model';

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
    employeeId: 9, // or get from session
    startDate: new Date(),
    endDate: new Date(),
    typeId: 1, // default or based on your logic
    status: 'pending',
    reason: '',
    isEarned: false,
  };

  constructor(private homeService: HomeService) { }

  ngOnInit() {
    this.loadPositionByEmployeeId(9);
  }

  loadPositionByEmployeeId(employeeId: number) {
    this.homeService.getPositionByEmployeeId(employeeId).subscribe((data: string) => {
      this.positionByEmployeeId = data;
      this.loadCounts();
    })
  }

  private loadCounts() {
    if (this.positionByEmployeeId === 'AD' || this.positionByEmployeeId === 'HR') {
      // only for admins / HR, fetch counts
      this.homeService.getAllEmployeesCount()
        .subscribe(count => this.totalEmployees = count);
      this.homeService.getAllTimeoffsCount()
        .subscribe(count => this.totalTimeoffs = count);
    }

    if (this.positionByEmployeeId === 'EM') {
      // for regular employees, fetch remaining leave
      this.homeService.getRemainingTimeoffByEmployeeId(9)
        .subscribe(data => this.remainingTimeoff = data);
    }
  }


  onSubmitTimeoff(value: any) {

  }
}
