import {Component, DestroyRef, OnInit} from '@angular/core';
import {AuthService} from '../../login/service/auth.service';
import {Employee} from '../../employee-list/model/employee.model';
import {Timeoff} from '../../timeoff-list/model/timeoff.model';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ProfileService} from '../service/profile.service';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgClass,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  employeeByEmployeeId?: Employee;
  timeoffsByEmployeeId?: Timeoff[];
  infoName: 'Personal Information' | 'Contact Information' | 'Business Information' = 'Personal Information';
  employeeId: number = 0;
  errorMessage: string = '';
  showPersonalInformation: boolean = true;
  showContactInformation: boolean = false;
  showBusinessInformation: boolean = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private destroyRef: DestroyRef,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.employeeId = this.authService.getEmployeeId() ?? 0;
    if (this.authService.isLoggedIn() === false) {
      this.authService.logout();
    }

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
      emailControl: new FormControl('', {
        validators: [Validators.email, Validators.required, Validators.maxLength(50)],
      }),
      passwordControl: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6), Validators.maxLength(50)],
      }),
      positionControl: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      startDateControl: new FormControl(new Date(), {
        validators: [Validators.required],
      }),
      addressControl: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      phoneNumberControl: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(50)],
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
            emailControl: employee.email,
            passwordControl: employee.password,
            positionControl: employee.position,
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
}
