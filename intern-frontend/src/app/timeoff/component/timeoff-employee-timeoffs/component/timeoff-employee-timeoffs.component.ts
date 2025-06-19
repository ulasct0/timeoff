import {Component, Input, OnInit} from '@angular/core';
import {TimeoffEmployeeTimeoffComponent} from './timeoff-employee-timeoff/component/timeoff-employee-timeoff.component';
import {TimeoffService} from '../../../service/timeoff.service';
import {Timeoff} from '../../../model/timeoff.model';

@Component({
  selector: 'app-timeoff-employee-timeoffs',
  standalone: true,
  imports: [TimeoffEmployeeTimeoffComponent],
  templateUrl: './timeoff-employee-timeoffs.component.html',
  styleUrl: './timeoff-employee-timeoffs.component.css',
})
export class TimeoffEmployeeTimeoffsComponent implements OnInit {
  @Input({required: true}) employeeId!: number;
  @Input() name?: string;
  isAddingTimeoff = false;
  timeoffs: Timeoff[] = [];

  constructor(private timeoffService: TimeoffService) {
  }

  get selectedUserTimeoffs() {
    return this.timeoffs.filter((timeoff) => timeoff.employeeId === this.employeeId);
  }

  ngOnInit(): void {
    this.timeoffService.fetchAllTimeoffs().subscribe((timeoffs) => {
      this.timeoffs = timeoffs;
    });
  }

  onCompleteTimeoff(timeoffId: number) {
    this.timeoffs = this.timeoffs.filter((timeoff) => timeoff.id !== timeoffId);
    console.log(`Timeoff with ID ${timeoffId} completed and removed from the list.`);
  }

  onStartAddTimeoff() {
    this.isAddingTimeoff = true;
  }
}
