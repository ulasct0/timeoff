import {Component, DestroyRef, OnInit} from '@angular/core';
import {AuthService} from '../../login/service/auth.service';
import {DashboardService} from '../service/dashboard.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {forkJoin} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {Timeoff} from '../../timeoff-list/model/timeoff.model';
import {TimeoffService} from '../../timeoff-list/service/timeoff.service';
import {Router} from '@angular/router';
import {timeoffTypes} from '../model/dashboard.model';
import {DropdownModule} from 'primeng/dropdown';
import {Select} from 'primeng/select';

@Component({
  selector: 'app-dashboard',
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    DropdownModule,
    Select
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  timeoffForm!: FormGroup;
  employeeId: number = 0;
  usedTimeoffs: number = 0;
  remainingTimeoffs: number = 0;
  positionByEmployeeId?: string;
  totalEmployees = 0;
  totalTimeoffs = 0;
  timeoffTypes = timeoffTypes;
  errorMessage!: string;
  submitted = false;

  startDateControl!: FormControl;
  endDateControl!: FormControl;
  reasonControl!: FormControl;
  typeControl!: FormControl;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private dashboardService: DashboardService,
    private destroyRef: DestroyRef,
    private timeoffService: TimeoffService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.employeeId = this.authService.getEmployeeId() ?? 0;
    if (this.authService.isLoggedIn() === false) {
      this.authService.logout();
    }

    this.timeoffForm = this.formBuilder.group({
      startDate: new FormControl('', {
        validators: [Validators.required],
      }),
      endDate: new FormControl('', {
        validators: [Validators.required],
      }),
      type: new FormControl('', {
        validators: [Validators.required],
      }),
      reason: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(200)],
      })
    });

    this.startDateControl = this.timeoffForm.controls['startDate'] as FormControl;
    this.endDateControl = this.timeoffForm.controls['endDate'] as FormControl;
    this.reasonControl = this.timeoffForm.controls['reason'] as FormControl;
    this.typeControl = this.timeoffForm.controls['type'] as FormControl;

    this.dashboardService.getPositionByEmployeeId(this.employeeId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (pos) => {
          this.positionByEmployeeId = pos;

          if (pos === 'AD' || pos === 'HR') {
            // only for admins / HR, fetch counts
            this.dashboardService.getAllEmployeesCount()
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe({
                next: (count) => {
                  this.totalEmployees = count;
                }
              });

            this.dashboardService.getAllTimeoffsCount()
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe({
                next: (count) => {
                  this.totalTimeoffs = count;
                }
              });
          }
        }
      });

    forkJoin({
      remaining: this.dashboardService.getRemainingTimeoffByEmployeeId(this.employeeId),
      used: this.dashboardService.countUsedTimeoffsByEmployeeId(this.employeeId),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({remaining, used}) => {
          this.remainingTimeoffs = remaining;
          this.usedTimeoffs = used;
        },
        error: err => {
          console.error('Dashboard load failed', err);
        },
        complete: () => {
          console.log('Dashboard loaded.');
        }
      });
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';
    if (this.timeoffForm.invalid) {
      this.errorMessage = this.errorMessageHandler();
      this.timeoffForm.markAllAsTouched();
      return;
    }

    const payload: Timeoff = {
      id: 0,
      employeeId: this.employeeId,
      startDate: new Date(this.startDateControl.value),
      endDate: new Date(this.endDateControl.value),
      status: 'Pending',
      reason: this.reasonControl.value,
      typeId: this.typeControl.value,
    };

    this.timeoffService.createTimeoff(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          console.log('Timeoff created:', data);
          this.submitted = false;
          this.timeoffForm.reset({status: 'Pending'});
          this.refreshCounts();
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.submitted = false;
        },
        complete: () => console.log('Timeoff creation completed.')
      })
  }

  goToProfile() {
    //navigate to profile
    this.router.navigate(['/profile']);
  }

  private errorMessageHandler(): string {
    if (
      this.startDateControl.hasError('required') ||
      this.endDateControl.hasError('required') ||
      this.reasonControl.hasError('required')
    ) {
      return 'Please fill in all required fields.';
    }
    if (new Date(this.endDateControl.value) < new Date(this.startDateControl.value)) {
      return 'End date cannot be before start date.';
    }
    return '';
  }

  private refreshCounts() {
    if (this.positionByEmployeeId === 'EM') {
      this.dashboardService.getRemainingTimeoffByEmployeeId(this.employeeId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(rem => this.remainingTimeoffs = rem);
    } else {
      forkJoin({
        totalTimeoffs: this.dashboardService.getAllTimeoffsCount(),
        totalEmployees: this.dashboardService.getAllEmployeesCount()
      }).subscribe(({totalTimeoffs, totalEmployees}) => {
        this.totalTimeoffs = totalTimeoffs;
        this.totalEmployees = totalEmployees;
      });
    }
    this.dashboardService.countUsedTimeoffsByEmployeeId(this.employeeId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(used => this.usedTimeoffs = used);
  }
}
