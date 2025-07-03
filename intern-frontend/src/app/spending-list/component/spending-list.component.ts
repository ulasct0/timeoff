import {Component, DestroyRef, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Spending} from '../model/spending.model';
import {SpendingService} from '../service/spending.service';
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

@Component({
  selector: 'app-spending-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    CommonModule,
    DropdownModule,
    ToastModule,
    Button,
  ],
  templateUrl: './spending-list.component.html',
  styleUrl: './spending-list.component.css'
})
export class SpendingListComponent implements OnInit {
  spendings: Spending[] = [];
  filteredSpendings: Spending[] = [];
  filterText: string = '';
  showDialog: boolean = false;
  countPendingSpendings: number = 0;
  countTodayAndApprovedSpendings: number = 0;
  countAllSpendingsByEmployeeId: number = 0;
  countAllSpendings: number = 0;
  selectedSpending: Spending = {
    id: 0,
    employeeId: 0,
    startDate: new Date(),
    endDate: new Date(),
    spendingAmount: 0,
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
  hideAllSpendings: boolean = false;
  alertMessage = '';
  alertType: 'success' | 'danger' = 'success';
  employeeId: number = 0;
  protected readonly Date = Date;

  constructor(
    private spendingService: SpendingService,
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

    this.spendingService.countPendingSpendings()
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => this.countPendingSpendings = data);
    this.spendingService.countTodayAndApprovedSpendings()
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => this.countTodayAndApprovedSpendings = data);
    this.spendingService.countAllSpendingsByEmployeeId(this.employeeId)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => this.countAllSpendingsByEmployeeId = data);
    this.spendingService.countAllSpendings()
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => this.countAllSpendings = data);

    this.employeeService.fetchEmployeeById(this.employeeId)
      .subscribe({
        next: (data) => {
          this.authorizedEmployee = data;
          this.loggedInEmployeeType = data.position;
          if (data.position == 'EM') {
            this.spendingService.getAllSpendingsByEmployeeId(this.employeeId).subscribe(data => {
              this.spendings = data.sort((a, b) => a.id - b.id);
              this.filteredSpendings = data.sort((a, b) => a.id - b.id);
            });
          } else {
            this.spendingService.getAllSpendings().subscribe(data => {
              this.spendings = data.sort((a, b) => a.id - b.id);
              this.filteredSpendings = data.sort((a, b) => a.id - b.id);
            });
          }
        },
      });
  }

  filterSpendings(search: string): void {
    const term = search.trim().toLowerCase();
    this.filteredSpendings = this.spendings.filter(item =>
      item.id.toString().includes(term) ||
      item.employeeId.toString().includes(term) ||
      item.startDate.toString().includes(term) ||
      item.endDate.toString().includes(term) ||
      item.spendingAmount.toString().includes(term) ||
      item.status.toLowerCase().includes(term) ||
      item.reason.toLowerCase().includes(term)
    );
  }

  openDialog(formType: "Edit" | "Add" | "View", spending?: Spending, employeeId?: number): void {
    if (spending) {
      this.selectedSpending = spending;
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

  deleteSpending(id: number): void {
    const isConfirmed = window.confirm('Are you sure you want to delete this spending?');
    if (isConfirmed) {
      this.spendingService.deleteSpending(id).subscribe({
        next: () => {
          this.spendings = this.spendings.filter((item) => item.id !== id);
          window.location.reload(); // Optionally remove this and update customers locally
        }
      });
    }
  }

  closeDialog() {
    this.showDialog = false;
    this.selectedSpending = {
      id: 0,
      employeeId: 0,
      startDate: new Date(),
      endDate: new Date(),
      spendingAmount: 0,
      status: 'Pending',
      reason: '',
    };
  }

  addOrEditSpending(spending: Spending) {
    spending.employeeId = this.employeeId;
    spending.status = "Pending";
    if (spending.id !== 0) {
      this.spendingService.updateSpending(spending).subscribe({
        next: (data) => {
          console.log('Spending updated:', data);
          this.showDialog = false;
          window.location.reload();
        },
        error: (error) => console.error('Error updating spending:', error),
      });
    } else {
      this.spendingService.createSpending(spending).subscribe({
        next: (data) => {
          console.log('Spending created:', data);
          this.showDialog = false;
          window.location.reload();
        },
        error: (error) => console.error('Error creating spending:', error),
      });
    }
  }

  changeSpendingStatus(id: number): void {

    this.spendingService.changeSpendingStatus(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedSpending: Spending) => {
          console.log('Status changed:', updatedSpending);
          if (updatedSpending.status === 'Approved') {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Spending #${updatedSpending.id} approved!`,
            });
            this.showAlert('success', `Spending #${updatedSpending.id} approved!`);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Spending #${updatedSpending.id} rejected!`,
            });
            this.showAlert('danger', `Spending #${updatedSpending.id} rejected!`);
          }
          this.employeeService.fetchEmployeeById(this.employeeId)
            .subscribe({
              next: (data) => {
                this.loggedInEmployeeType = data.position;
                if (data.position == 'EM') {
                  this.spendingService.getAllSpendingsByEmployeeId(this.employeeId).subscribe(data => {
                    this.spendings = data.sort((a, b) => a.id - b.id);
                    this.filteredSpendings = data.sort((a, b) => a.id - b.id);
                  });
                } else {
                  this.spendingService.getAllSpendings().subscribe(data => {
                    this.spendings = data.sort((a, b) => a.id - b.id);
                    this.filteredSpendings = data.sort((a, b) => a.id - b.id);
                  });
                }

              },
            });
        }
      });
  }

  showMySpendings() {
    this.hideAllSpendings = !this.hideAllSpendings;

    if (this.hideAllSpendings) {
      this.spendingService.getAllSpendingsByEmployeeId(this.employeeId).subscribe(data => {
        this.spendings = data;
        this.filteredSpendings = data;
      });
    } else {
      this.spendingService.getAllSpendings().subscribe(data => {
        this.spendings = data;
        this.filteredSpendings = data;
      });
    }
  }

  showPendingSpendings() {
    this.hideAllSpendings = !this.hideAllSpendings;

    if (this.hideAllSpendings) {
      this.spendingService.getPendingSpendings().subscribe(data => {
        this.spendings = data;
        this.filteredSpendings = data;
      });
    } else {
      this.spendingService.getAllSpendings().subscribe(data => {
        this.spendings = data;
        this.filteredSpendings = data;
      });
    }
  }

  showTodayAndApprovedSpendings() {
    this.hideAllSpendings = !this.hideAllSpendings;

    if (this.hideAllSpendings) {
      this.spendingService.getTodayAndApprovedSpendings().subscribe(data => {
        this.spendings = data;
        this.filteredSpendings = data;
      });
    } else {
      this.spendingService.getAllSpendings().subscribe(data => {
        this.spendings = data;
        this.filteredSpendings = data;
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
