import {Component, DestroyRef, OnInit} from '@angular/core';
import {Button} from 'primeng/button';
import {NgClass, NgIf, NgStyle} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {Toast} from 'primeng/toast';
import {Employee} from '../../employee-list/model/employee.model';
import {EmployeeListService} from '../../employee-list/service/employee-list.service';
import {AuthService} from '../../login/service/auth.service';
import {MessageService} from 'primeng/api';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Leave, Status} from '../model/leave.model';
import {LeaveWithFullName} from '../dto/LeaveWithFullName.dto';
import {LeaveService} from '../service/leave.service';
import {Position} from '../../employee-list/dto/Position.dto';

@Component({
  selector: 'app-leave',
  imports: [
    Button,
    NgIf,
    ReactiveFormsModule,
    TableModule,
    Toast,
    FormsModule,
    NgStyle,
    NgClass
  ],
  templateUrl: './leave.component.html',
  styleUrl: './leave.component.css'
})
export class LeaveComponent implements OnInit {
  leaves: LeaveWithFullName[] = [];
  filteredLeaves: LeaveWithFullName[] = [];
  filterText: string = '';
  showDialog: boolean = false;
  countPendingLeaves: number = 0;
  countTodayAndApprovedLeaves: number = 0;
  countAllLeavesByEmployeeId: number = 0;
  countAllLeaves: number = 0;
  selectedLeave: Leave = {
    id: 0,
    employeeId: 0,
    date: new Date(),
    status: Status.Pending,
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
    position: Position.EM,
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
    position: Position.EM,
    salary: 0,
    phoneNumber: '',
    startDate: new Date()
  };

  loggedInEmployeeType = "EM";
  formType: "Edit" | "View" = "Edit";
  hideAllLeaves: boolean = false;
  alertMessage = '';
  alertType: 'success' | 'danger' = 'success';
  employeeId: number = 0;
  protected readonly Date = Date;

  constructor(
    private leaveService: LeaveService,
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

    this.leaveService.countPendingLeaves()
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => this.countPendingLeaves = data);
    this.leaveService.countTodayAndApprovedLeaves()
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => this.countTodayAndApprovedLeaves = data);
    this.leaveService.countAllLeavesByEmployeeId(this.employeeId)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => this.countAllLeavesByEmployeeId = data);
    this.leaveService.countAllLeaves()
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => this.countAllLeaves = data);

    this.employeeService.fetchEmployeeById(this.employeeId)
      .subscribe({
        next: (data) => {
          this.authorizedEmployee = data;
          this.loggedInEmployeeType = data.position;
          if (data.position == 'EM') {
            this.leaveService.getAllLeavesByEmployeeIdWithFullName(this.employeeId).subscribe(data => {
              this.leaves = data;
              this.filteredLeaves = data;
            });
          } else {
            this.leaveService.getAllLeavesWithFullName().subscribe(data => {
              this.leaves = data;
              this.filteredLeaves = data;
            });
          }
        },
      });
  }


  filterLeaves(search: string): void {
    const term = search.trim().toLowerCase();
    this.filteredLeaves = this.leaves.filter(item =>
      item.id.toString().includes(term) ||
      item.employeeId.toString().includes(term) ||
      item.employeeFullName.toLowerCase().includes(term) ||
      item.date.toString().includes(term) ||
      item.status.toLowerCase().includes(term) ||
      item.reason.toLowerCase().includes(term)
    );
  }

  openDialog(formType: "Edit" | "View", leave?: Leave, employeeId?: number): void {
    if (leave) {
      this.selectedLeave = leave;
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

  deleteLeave(id: number): void {
    const isConfirmed = window.confirm('Are you sure you want to delete this leave?');
    if (isConfirmed) {
      this.leaveService.deleteLeave(id).subscribe({
        next: () => {
          window.location.reload(); // Optionally remove this and update customers locally
        }
      });
    }
  }

  closeDialog() {
    this.showDialog = false;
    this.selectedLeave = {
      id: 0,
      employeeId: 0,
      date: new Date(),
      status: Status.Pending,
      reason: '',
    };
  }

  addOrEditLeave(leave: Leave) {
    leave.employeeId = this.employeeId;
    leave.status = Status.Pending;
    if (leave.id !== 0) {
      this.leaveService.updateLeave(leave).subscribe({
        next: (data) => {
          console.log('Leave updated:', data);
          this.showDialog = false;
          window.location.reload();
        },
        error: (error) => console.error('Error updating Leave:', error),
      });
    } else {
      this.leaveService.createLeave(leave).subscribe({
        next: (data) => {
          console.log('Leave created:', data);
          this.showDialog = false;
          window.location.reload();
        },
        error: (error) => console.error('Error creating leave:', error),
      });
    }
  }

  changeLeaveStatus(id: number): void {

    this.leaveService.changeLeaveStatus(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedLeave: Leave) => {
          console.log('Status changed:', updatedLeave);
          if (updatedLeave.status === 'Approved') {
            this.leaveService.changeEmployeePositionByEmployeeId(updatedLeave.employeeId, Position.LF)
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe({
                next: (data) => {
                  if (data) {
                    window.location.reload();
                    console.log('The user is no longer an employee!');
                  }
                }
              });
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Leave #${updatedLeave.id} approved!`,
            });
            this.showAlert('success', `Leave #${updatedLeave.id} approved!`);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Leave #${updatedLeave.id} rejected!`,
            });
            this.showAlert('danger', `Leave #${updatedLeave.id} rejected!`);
          }
          this.employeeService.fetchEmployeeById(this.employeeId)
            .subscribe({
              next: (data) => {
                this.loggedInEmployeeType = data.position;
                if (this.selectedEmployee.id === data.id) {
                  this.selectedEmployee = data;
                }
                if (data.position == 'EM') {
                  this.leaveService.getAllLeavesByEmployeeIdWithFullName(this.employeeId).subscribe(data => {
                    this.leaves = data;
                    this.filteredLeaves = data;
                  });
                } else {
                  this.leaveService.getAllLeavesWithFullName().subscribe(data => {
                    this.leaves = data;
                    this.filteredLeaves = data;
                  });
                }

              },
            });
        }
      });
  }

  showPendingLeaves() {
    this.hideAllLeaves = !this.hideAllLeaves;

    if (this.hideAllLeaves) {
      this.leaveService.getPendingLeaves().subscribe(data => {
        this.leaves = data;
        this.filteredLeaves = data;
      });
    } else {
      this.leaveService.getAllLeavesWithFullName().subscribe(data => {
        this.leaves = data;
        this.filteredLeaves = data;
      });
    }
  }

  showTodayAndApprovedLeaves() {
    this.hideAllLeaves = !this.hideAllLeaves;

    if (this.hideAllLeaves) {
      this.leaveService.getTodayAndApprovedLeaves().subscribe(data => {
        this.leaves = data;
        this.filteredLeaves = data;
      });
    } else {
      this.leaveService.getAllLeavesWithFullName().subscribe(data => {
        this.leaves = data;
        this.filteredLeaves = data;
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

  protected readonly Position = Position;
  protected readonly Status = Status;
}
