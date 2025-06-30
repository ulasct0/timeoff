import {Component, OnInit} from '@angular/core';
import {Employee} from '../model/employee.model';
import {EmployeeListService} from '../service/employee-list.service';
import {FormsModule} from '@angular/forms';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';


@Component({
  selector: 'app-component',
  standalone: true,
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    NgClass,
    NgStyle,
  ],
})

export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  filterText: string = '';
  showDialog: boolean = false;
  selectedEmployee: Employee = {
    id: 0,
    name: '',
    email: '',
    address: '',
    surname: '',
    avatar: '',
    password: '',
    position: '',
    phoneNumber: '',
    startDate: new Date()
  };
  formType: "Edit" | "Add" | "View" = "Add";

  constructor(private employeeListService: EmployeeListService) {
  }

  ngOnInit(): void {
    this.employeeListService.fetchAllEmployees().subscribe(data => {
      this.employees = data;
      this.filteredEmployees = data;
    });
  }

  filterEmployees(search: string): void {
    const term = search.trim().toLowerCase();
    this.filteredEmployees = this.employees.filter(item =>
      item.name.toLowerCase().includes(term) ||
      item.surname.toLowerCase().includes(term) ||
      item.avatar.toLowerCase().includes(term) ||
      item.email.toLowerCase().includes(term) ||
      item.password.toLowerCase().includes(term) ||
      item.position.toLowerCase().includes(term) ||
      item.address.toLowerCase().includes(term) ||
      item.phoneNumber.toLowerCase().includes(term) ||
      item.startDate.toString().includes(term)
    );
  }

  openEmpDialog(formType: "Edit" | "Add" | "View", employee?: Employee): void {
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
      email: '',
      address: '',
      surname: '',
      avatar: '',
      password: '',
      position: '',
      phoneNumber: '',
      startDate: new Date()
    };
  }

  deleteEmployee(id: number): void {
    const isConfirmed = window.confirm('Are you sure you want to delete this customer?');
    if (isConfirmed) {
      this.employeeListService.deleteEmployee(id).subscribe(() => {
        this.employees = this.employees.filter((item) => item.id !== id);
        window.location.reload(); // Optionally remove this and update customers locally
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
}
