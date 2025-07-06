import {Component, DestroyRef, OnInit} from '@angular/core';
import {AuthService} from '../../login/service/auth.service';
import {Employee} from '../../employee-list/model/employee.model';
import {Timeoff} from '../../timeoff-list/model/timeoff.model';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ProfileService} from '../service/profile.service';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass, NgIf} from '@angular/common';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {InputText} from 'primeng/inputtext';
import {LeaveService} from '../../leave/service/leave.service';
import {Leave, Status} from '../../leave/model/leave.model';
import {Message} from 'primeng/message';

@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgClass,
    Button,
    Dialog,
    InputText,
    FormsModule,
    Message,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  leaveForm!: FormGroup;
  employeeByEmployeeId?: Employee;
  timeoffsByEmployeeId?: Timeoff[];
  infoName: 'Personal Information' | 'Contact Information' | 'Business Information' = 'Personal Information';
  employeeId: number = 0;
  errorMessage: string = '';
  showPersonalInformation: boolean = true;
  showContactInformation: boolean = false;
  showBusinessInformation: boolean = false;
  showPassword = false;
  showDialog: boolean = false;
  showMessage: boolean = false;
  infoMessage: string = '';
  dangerMessage: string = '';

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private destroyRef: DestroyRef,
    private formBuilder: FormBuilder,
    private leaveService: LeaveService,
  ) {
  }

  ngOnInit(): void {
    this.employeeId = this.authService.getEmployeeId() ?? 0;
    if (this.authService.isLoggedIn() === false) {
      this.authService.logout();
    }

    this.leaveForm = this.formBuilder.group({
      reason: ['', [Validators.required, Validators.maxLength(100)]]
    });

    this.profileForm = this.formBuilder.group({
      employeeIdControl: new FormControl(this.employeeId, {
        validators: [Validators.required],
      }),
      nameControl: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      surnameControl: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      genderControl: new FormControl('', {
        validators: [Validators.required],
      }),
      emailControl: new FormControl('', {
        validators: [Validators.email, Validators.required, Validators.maxLength(50)],
      }),
      passwordControl: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6), Validators.maxLength(50)],
      }),
      positionControl: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      salaryControl: new FormControl('', {
        validators: [Validators.required, Validators.min(0)],
      }),
      addressControl: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      phoneNumberControl: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      startDateControl: new FormControl(new Date(), {
        validators: [Validators.required],
      }),
    })

    this.profileService.fetchEmployeeById(this.employeeId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (employee) => {
          this.employeeByEmployeeId = employee;
          this.profileForm.patchValue({
            employeeIdControl: employee.id,
            nameControl: employee.name,
            surnameControl: employee.surname,
            genderControl: employee.gender,
            emailControl: employee.email,
            passwordControl: employee.password,
            positionControl: employee.position,
            salaryControl: employee.salary,
            startDateControl: employee.startDate,
            addressControl: employee.address,
            phoneNumberControl: employee.phoneNumber,
          });
        },
        error: (err) => {
          this.errorMessage = err.message;
        },
        complete: () => {
          console.log('Employee fetched.')
          console.log(this.employeeByEmployeeId)
        }
      });
    this.profileService.fetchTimeoffsByEmployeeId(this.employeeId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (timeoffs) => {
          this.timeoffsByEmployeeId = timeoffs;
        },
        error: (err) => {
          this.errorMessage = err.message;
        },
        complete: () => {
          console.log('Timeoffs fetched.')
          console.log(this.timeoffsByEmployeeId)
        }
      })


  }

  openPersonalInformation() {
    this.showPersonalInformation = true
    this.showContactInformation = false
    this.showBusinessInformation = false
    this.infoName = 'Personal Information'
  }

  openContactInformation() {
    this.showContactInformation = true
    this.showPersonalInformation = false
    this.showBusinessInformation = false
    this.infoName = 'Contact Information'
  }

  openBusinessInformation() {
    this.showBusinessInformation = true
    this.showPersonalInformation = false
    this.showContactInformation = false
    this.infoName = 'Business Information'
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  openCreateLeave() {
    this.showDialog = true;
  }

  createNewLeave() {
    if (this.leaveForm.invalid) {
      return;
    }

    const isCreating = window.confirm("Are you sure you want to leave this leave?");

    const payload: Leave = {
      id: 0,
      employeeId: this.employeeId,
      date: new Date(),
      status: Status.Pending,
      reason: this.leaveForm.value.reason,
    }

    if (!isCreating) {
      this.showDialog = false;
      return;
    }

    this.leaveService.createLeave(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.showMessage = true;
          this.infoMessage = 'Pending The Request!';
          this.leaveForm.reset();
        },
        error: (err) => {
          this.showMessage = true;
          this.dangerMessage = err.message + "employee couldn't be canceled";
        },
        complete: () => {
          this.showDialog = false;
        }
      })
  }
}
