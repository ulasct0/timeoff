import {Component, OnInit} from '@angular/core';
import {Employee} from '../model/employee.model';
import {EmployeeListService} from '../service/employee-list.service';
import {FormsModule} from '@angular/forms';
import {NgClass, NgIf, NgStyle} from '@angular/common';
import {AuthService} from '../../login/service/auth.service';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {Select} from 'primeng/select';
import {Position} from '../dto/Position.dto';


@Component({
  selector: 'app-component',
  standalone: true,
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css',
  imports: [
    FormsModule,
    NgIf,
    NgClass,
    NgStyle,
    TableModule,
    DropdownModule,
    Select,
  ],
})

export class EmployeeListComponent implements OnInit {
  employeeId: number = 0;
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  filterText: string = '';
  showDialog: boolean = false;
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
  formType: "Edit" | "Add" | "View" = "Add";
  genders: { id: number, label: string }[] = [
    {id: 1, label: 'MALE'},
    {id: 2, label: 'FEMALE'}
  ];
  loggedInEmployeeType = "EM";
  hideAllEmployees: boolean = false;

  constructor(
    private employeeListService: EmployeeListService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.employeeId = this.authService.getEmployeeId() ?? 0;
    if (this.authService.isLoggedIn() === false) {
      this.authService.logout();
    }

    this.employeeListService.fetchAllEmployees().subscribe({
      next: data => {
        this.employees = data;
        this.filteredEmployees = data;
        this.employeeListService.fetchEmployeeById(this.employeeId)
          .subscribe({
            next: (data) => {
              this.loggedInEmployeeType = data.position;
            },
          });
      }
    });


  }

  filterEmployees(search: string): void {
    const term = search.trim().toLowerCase();
    this.filteredEmployees = this.employees.filter(item =>
      item.name.toLowerCase().includes(term) ||
      item.surname.toLowerCase().includes(term) ||
      item.gender.toLowerCase().includes(term) ||
      item.avatar.toLowerCase().includes(term) ||
      item.email.toLowerCase().includes(term) ||
      item.password.toLowerCase().includes(term) ||
      item.position.toLowerCase().includes(term) ||
      item.salary.toString().includes(term) ||
      item.address.toLowerCase().includes(term) ||
      item.phoneNumber.toLowerCase().includes(term) ||
      item.startDate.toString().includes(term)
    );
  }

  openDialog(formType: "Edit" | "Add" | "View", employee?: Employee): void {
    this.formType = formType;
    if (employee) {
      this.selectedEmployee = employee;
    }
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
    this.selectedEmployee = {
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
  }

  deleteEmployee(id: number): void {
    const isConfirmed = window.confirm('Are you sure you want to delete this customer?');
    if (isConfirmed) {
      this.employeeListService.deleteEmployee(id).subscribe({
        next: () => {
          this.employees = this.employees.filter((item) => item.id !== id);
          window.location.reload();
        }
      });
    }
  }

  addOrEditEmployee(employee: Employee) {
    if (employee.id !== 0) {
      this.employeeListService.updateEmployee(employee).subscribe({
        next: (data) => {
          console.log('Employee updated:', data);
          this.showDialog = false;
          window.location.reload();
        },
        error: (error) => console.error('Error updating employee:', error),
      });
    } else {
      this.employeeListService.createEmployee(employee).subscribe({
        next: (data) => {
          console.log('Customer created:', data);
          this.showDialog = false;
          window.location.reload();
        },
        error: (error) => console.error('Error creating employee:', error),
      });
    }
  }

  positionStrecthed(employee: Employee): string {
    if (employee.position === 'EM') {
      return 'Employee';
    } else if (employee.position === 'HR') {
      return 'Human Resources';
    } else if (employee.position === 'AD') {
      return 'Admin';
    }
    return '';
  }

  showEmployeesOnTimeoff() {
    this.hideAllEmployees = !this.hideAllEmployees;

    if (this.hideAllEmployees) {
      this.employeeListService.getEmployeesOnTimeoff().subscribe({
        next: (data) => {
          this.employees = data;
          this.filteredEmployees = data;
        }
      });
    } else {
      this.employeeListService.fetchAllEmployees().subscribe({
        next: (data) => {
          this.employees = data;
          this.filteredEmployees = data;
        }
      });
    }
  }
}
