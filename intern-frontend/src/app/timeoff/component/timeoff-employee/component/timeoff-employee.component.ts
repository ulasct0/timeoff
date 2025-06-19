import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Employee} from '../../../../employee-list/model/employee.model';

@Component({
  selector: 'app-timeoff-employee',
  standalone: true,
  templateUrl: './timeoff-employee.component.html',
  styleUrl: './timeoff-employee.component.css',
})
export class TimeoffEmployeeComponent {
  @Input({required: true}) employee!: Employee;
  @Input({required: true}) selected!: boolean;
  @Output() select = new EventEmitter<number>();

  onSelectUser() {
    this.select.emit(this.employee.id);
  }
}
