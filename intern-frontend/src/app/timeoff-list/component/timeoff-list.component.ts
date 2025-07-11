import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Timeoff} from '../model/timeoff.model';
import {TimeoffService} from '../service/timeoff.service';
import {EmployeeListService} from '../../employee-list/service/employee-list.service';
import {AuthService} from '../../login/service/auth.service';

@Component({
  selector: 'app-timeoff-list',
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    NgClass,
    NgStyle,
  ],
  templateUrl: './timeoff-list.component.html',
  styleUrl: './timeoff-list.component.css'
})
export class TimeoffListComponent implements OnInit {
  timeoffs: Timeoff[] = [];
  filteredTimeoffs: Timeoff[] = [];
  filterText: string = '';
  showDialog: boolean = false;
  selectedTimeoff: Timeoff = {
    id: 0,
    employeeId: 0,
    startDate: new Date(),
    endDate: new Date(),
    typeId: 0,
    status: 'Pending',
    reason: '',
  };
  loggedInEmployeeType = "EM";
  formType: string = "Add";
  hideAllTimeoffs: boolean = false;

  timeoffTypes: { id: number; label: string }[] = [
    {id: 1, label: 'Paid Leave'},
    {id: 2, label: 'Unpaid Leave'},
    {id: 3, label: 'Birthday Leave'},
  ];
  employeeId: number = 0;

  constructor(
    private timeoffService: TimeoffService,
    private employeeService: EmployeeListService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.employeeId = this.authService.getEmployeeId() ?? 0;
    if (this.authService.isLoggedIn() === false) {
      this.authService.logout();
    }

    this.employeeService.fetchEmployeeById(this.employeeId)
      .subscribe({
        next: (data) => {
          this.loggedInEmployeeType = data.position;
          if (data.position == 'EM') {
            this.timeoffService.getAllTimeoffsByEmployeeId(this.employeeId).subscribe(data => {
              this.timeoffs = data.sort((a, b) => a.id - b.id);
              this.filteredTimeoffs = data.sort((a, b) => a.id - b.id);
            });
          } else {
            this.timeoffService.fetchAllTimeoffs().subscribe(data => {
              this.timeoffs = data.sort((a, b) => a.id - b.id);
              this.filteredTimeoffs = data.sort((a, b) => a.id - b.id);
            });
          }

        },
      });
  }

  filterTimeoffs(search: string): void {
    const term = search.trim().toLowerCase();
    this.filteredTimeoffs = this.timeoffs.filter(item =>
      item.id.toString().includes(term) ||
      item.employeeId.toString().includes(term) ||
      item.startDate.toString().includes(term) ||
      item.endDate.toString().includes(term) ||
      item.typeId.toString().includes(term) ||
      item.status.toLowerCase().includes(term) ||
      item.reason.toLowerCase().includes(term)
    );
  }

  openTimeoffDialog(timeoff?: Timeoff): void {
    if (timeoff) {
      this.selectedTimeoff = timeoff;
      this.formType = "Edit";
    } else {
      this.formType = "Add";
    }
    this.showDialog = true;
  }

  deleteTimeoff(id: number): void {
    const isConfirmed = window.confirm('Are you sure you want to delete this timeoff?');
    if (isConfirmed) {
      this.timeoffService.deleteTimeoff(id).subscribe(() => {
        this.timeoffs = this.timeoffs.filter((item) => item.id !== id);
        window.location.reload(); // Optionally remove this and update customers locally
      });
    }
  }

  closeDialog() {
    this.showDialog = false;
    this.selectedTimeoff = {
      id: 0,
      employeeId: 0,
      startDate: new Date(),
      endDate: new Date(),
      typeId: 0,
      status: 'Pending',
      reason: '',
    };
  }

  addOrEditTimeoff(timeoff: Timeoff) {
    timeoff.employeeId = this.employeeId;
    timeoff.status = "Pending";
    if (timeoff.id !== 0) {
      this.timeoffService.updateTimeoff(timeoff).subscribe({
        next: (data) => {
          console.log('Timeoff updated:', data);
          this.showDialog = false;
          window.location.reload();
        },
        error: (error) => console.error('Error updating timeoff:', error),
      });
    } else {
      this.timeoffService.createTimeoff(timeoff).subscribe({
        next: (data) => {
          console.log('Timeoff created:', data);
          this.showDialog = false;
          window.location.reload();
        },
        error: (error) => console.error('Error creating timeoff:', error),
      });
    }
  }

  changeTimeoffStatus(id: number): void {
    this.timeoffService.changeTimeoffStatus(id)
      .subscribe({
        next: (updatedTimeoff: Timeoff) => {
          console.log('Status changed:', updatedTimeoff);
          this.employeeService.fetchEmployeeById(this.employeeId)
            .subscribe({
              next: (data) => {
                this.loggedInEmployeeType = data.position;
                if (data.position == 'EM') {
                  this.timeoffService.getAllTimeoffsByEmployeeId(this.employeeId).subscribe(data => {
                    this.timeoffs = data.sort((a, b) => a.id - b.id);
                    this.filteredTimeoffs = data.sort((a, b) => a.id - b.id);
                  });
                } else {
                  this.timeoffService.fetchAllTimeoffs().subscribe(data => {
                    this.timeoffs = data.sort((a, b) => a.id - b.id);
                    this.filteredTimeoffs = data.sort((a, b) => a.id - b.id);
                  });
                }

              },
            });
        }

      })

  }

  showMyTimeoffs() {
    this.hideAllTimeoffs = !this.hideAllTimeoffs;

    if (this.hideAllTimeoffs) {
      this.timeoffService.getAllTimeoffsByEmployeeId(this.employeeId).subscribe(data => {
        this.timeoffs = data.sort((a, b) => a.id - b.id);
        this.filteredTimeoffs = data.sort((a, b) => a.id - b.id);
      });
    } else {
      this.timeoffService.fetchAllTimeoffs().subscribe(data => {
        this.timeoffs = data.sort((a, b) => a.id - b.id);
        this.filteredTimeoffs = data.sort((a, b) => a.id - b.id);
      });
    }
  }
}
