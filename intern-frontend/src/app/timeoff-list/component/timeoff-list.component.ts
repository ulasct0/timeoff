import {Component, DestroyRef, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Timeoff} from '../model/timeoff.model';
import {TimeoffService} from '../service/timeoff.service';
import {EmployeeListService} from '../../employee-list/service/employee-list.service';
import {AuthService} from '../../login/service/auth.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Employee} from '../../employee-list/model/employee.model';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {Select} from 'primeng/select';
import {Button} from 'primeng/button';
import {TimeoffWithFullName} from '../dto/TimeoffWithFullName.dto';

@Component({
  selector: 'app-timeoff-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    CommonModule,
    DropdownModule,
    ToastModule,
    Select,
    Button,
  ],
  templateUrl: './timeoff-list.component.html',
  styleUrl: './timeoff-list.component.css'
})
export class TimeoffListComponent implements OnInit {
  timeoffs: TimeoffWithFullName[] = [];
  filteredTimeoffs: TimeoffWithFullName[] = [];
  filterText: string = '';
  showDialog: boolean = false;
  countPendingTimeoffs: number = 0;
  countTodayAndApprovedTimeoffs: number = 0;
  countAllTimeoffsByEmployeeId: number = 0;
  countAllTimeoffs: number = 0;
  selectedTimeoff: Timeoff = {
    id: 0,
    employeeId: 0,
    startDate: new Date(),
    endDate: new Date(),
    typeId: 0,
    status: 'Pending',
    reason: '',
  };
  selectedEmployee: Employee = {
    id: 0,
    name: '',
    surname: '',
    gender: 'MALE',
    email: '',
    address: '',
    avatar: '',
    password: '',
    position: '',
    salary: 0,
    phoneNumber: '',
    startDate: new Date()
  };
  authorizedEmployee: Employee = {
    id: 0,
    name: '',
    surname: '',
    gender: 'MALE',
    email: '',
    address: '',
    avatar: '',
    password: '',
    position: '',
    salary: 0,
    phoneNumber: '',
    startDate: new Date()
  };

  loggedInEmployeeType = "EM";
  formType: "Edit" | "Add" | "View" = "Add";
  hideAllTimeoffs: boolean = false;
  alertMessage = '';
  alertType: 'success' | 'danger' = 'success';

  timeoffTypes: { id: number; label: string }[] = [
    {id: 1, label: 'Paid Leave'},
    {id: 2, label: 'Unpaid Leave'},
    {id: 3, label: 'Birthday Leave'},
  ];
  employeeId: number = 0;
  protected readonly Date = Date;

  constructor(
    private timeoffService: TimeoffService,
    private employeeService: EmployeeListService,
    private authService: AuthService,
    private destroyRef: DestroyRef,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.employeeId = this.authService.getEmployeeId() ?? 0;
    if (this.authService.isLoggedIn() === false) {
      this.authService.logout();
    }

    this.timeoffService.countPendingTimeoffs()
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => this.countPendingTimeoffs = data);
    this.timeoffService.countTodayAndApprovedTimeoffs()
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => this.countTodayAndApprovedTimeoffs = data);
    this.timeoffService.countAllTimeoffsByEmployeeId(this.employeeId)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => this.countAllTimeoffsByEmployeeId = data);
    this.timeoffService.countAllTimeoffs()
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => this.countAllTimeoffs = data);

    this.employeeService.fetchEmployeeById(this.employeeId)
      .subscribe({
        next: (data) => {
          this.authorizedEmployee = data;
          this.loggedInEmployeeType = data.position;
          if (data.position == 'EM') {
            this.timeoffService.getAllTimeoffsByEmployeeIdWithFullName(this.employeeId).subscribe(data => {
              this.timeoffs = data;
              this.filteredTimeoffs = data;
            });
          } else {
            this.timeoffService.getAllTimeoffsWithFullName().subscribe(data => {
              this.timeoffs = data;
              this.filteredTimeoffs = data;
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
      item.employeeFullName.toLowerCase().includes(term) ||
      item.startDate.toString().includes(term) ||
      item.endDate.toString().includes(term) ||
      item.typeId.toString().includes(term) ||
      item.status.toLowerCase().includes(term) ||
      item.reason.toLowerCase().includes(term)
    );
  }

  openDialog(formType: "Edit" | "Add" | "View", timeoff?: Timeoff, employeeId?: number): void {
    if (timeoff) {
      this.selectedTimeoff = timeoff;
    } else if (employeeId) {
      this.employeeService.fetchEmployeeById(employeeId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: data => {
            this.selectedEmployee = data;
          }
        });
    }
    this.formType = formType;
    this.showDialog = true;
  }

  deleteTimeoff(id: number): void {
    const isConfirmed = window.confirm('Are you sure you want to delete this timeoff?');
    if (isConfirmed) {
      this.timeoffService.deleteTimeoff(id).subscribe({
        next: () => {
          window.location.reload(); // Optionally remove this and update customers locally
        }
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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedTimeoff: Timeoff) => {
          console.log('Status changed:', updatedTimeoff);
          if (updatedTimeoff.status === 'Approved') {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Timeoff #${updatedTimeoff.id} approved!`,
            });
            this.showAlert('success', `Timeoff #${updatedTimeoff.id} approved!`);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Timeoff #${updatedTimeoff.id} rejected!`,
            });
            this.showAlert('danger', `Timeoff #${updatedTimeoff.id} rejected!`);
          }
          this.employeeService.fetchEmployeeById(this.employeeId)
            .subscribe({
              next: (data) => {
                this.loggedInEmployeeType = data.position;
                if (data.position == 'EM') {
                  this.timeoffService.getAllTimeoffsByEmployeeIdWithFullName(this.employeeId).subscribe(data => {
                    this.timeoffs = data;
                    this.filteredTimeoffs = data;
                  });
                } else {
                  this.timeoffService.getAllTimeoffsWithFullName().subscribe(data => {
                    this.timeoffs = data;
                    this.filteredTimeoffs = data;
                  });
                }

              },
            });
        }
      });
  }

  showMyTimeoffs() {
    this.hideAllTimeoffs = !this.hideAllTimeoffs;

    if (this.hideAllTimeoffs) {
      this.timeoffService.getAllTimeoffsByEmployeeIdWithFullName(this.employeeId).subscribe(data => {
        this.timeoffs = data;
        this.filteredTimeoffs = data;
      });
    } else {
      this.timeoffService.getAllTimeoffsWithFullName().subscribe(data => {
        this.timeoffs = data;
        this.filteredTimeoffs = data;
      });
    }
  }

  showPendingTimeoffs() {
    this.hideAllTimeoffs = !this.hideAllTimeoffs;

    if (this.hideAllTimeoffs) {
      this.timeoffService.getPendingTimeoffs().subscribe(data => {
        this.timeoffs = data;
        this.filteredTimeoffs = data;
      });
    } else {
      this.timeoffService.getAllTimeoffsWithFullName().subscribe(data => {
        this.timeoffs = data;
        this.filteredTimeoffs = data;
      });
    }
  }

  showTodayAndApprovedTimeoffs() {
    this.hideAllTimeoffs = !this.hideAllTimeoffs;

    if (this.hideAllTimeoffs) {
      this.timeoffService.getTodayAndApprovedTimeoffs().subscribe(data => {
        this.timeoffs = data;
        this.filteredTimeoffs = data;
      });
    } else {
      this.timeoffService.getAllTimeoffsWithFullName().subscribe(data => {
        this.timeoffs = data;
        this.filteredTimeoffs = data;
      });
    }
  }

  goToEmail(sentEmail: string) {
    const email = sentEmail;
    const subject = encodeURIComponent(`From ${this.authorizedEmployee.name} ${this.authorizedEmployee.surname}`);
    const body = encodeURIComponent('This is where you write...');
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  }

  daysUntil(d: string | Date): number {
    const start = new Date(d);
    const today = new Date();

    // zero out the time portion so we’re only comparing dates
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);

    const msPerDay = 1000 * 60 * 60 * 24;
    const diffMs = start.getTime() - today.getTime();
    return Math.floor(diffMs / msPerDay);
  }

  private showAlert(type: 'success' | 'danger', msg: string, duration = 7 * 1000) {
    this.alertType = type;
    this.alertMessage = msg;
    setTimeout(() => this.alertMessage = '', duration);
  }
}
