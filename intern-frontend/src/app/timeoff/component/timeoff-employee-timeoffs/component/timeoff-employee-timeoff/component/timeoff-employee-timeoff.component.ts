import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Timeoff} from '../../../../../model/timeoff.model';

@Component({
  selector: 'app-timeoff-employee-timeoff',
  standalone: true,
  imports: [],
  templateUrl: './timeoff-employee-timeoff.component.html',
  styleUrl: './timeoff-employee-timeoff.component.css',
})
export class TimeoffEmployeeTimeoffComponent {
  @Input({required: true}) timeoff!: Timeoff;
  @Output() complete = new EventEmitter<number>();

  onCompleteTimeoff() {
    this.complete.emit(this.timeoff.id);
  }
}
