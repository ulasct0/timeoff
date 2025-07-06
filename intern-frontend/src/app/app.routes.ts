import {Routes} from '@angular/router';
import {EmployeeListComponent} from './employee-list/component/employee-list.component';
import {TimeoffListComponent} from './timeoff-list/component/timeoff-list.component';
import {ProfileComponent} from './profile/component/profile.component';
import {LoginComponent} from './login/component/login.component';
import {DashboardComponent} from './dashboard/component/dashboard.component';
import {MainComponent} from './main/main.component';
import {InformationComponent} from './information/information.component';
import {SpendingListComponent} from './spending-list/component/spending-list.component';
import {LeaveComponent} from './leave/component/leave.component';
import {LeftEmployeeComponent} from './left-employee/left-employee.component';

export const routes: Routes = [
  {
    path: 'employee-list',
    component: EmployeeListComponent,
  },
  {
    path: '',
    component: MainComponent
  },
  {
    path: 'information',
    component: InformationComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'timeoff-list',
    component: TimeoffListComponent,
  },
  {
    path: 'spending-list',
    component: SpendingListComponent,
  },
  {
    path: 'leave',
    component: LeaveComponent
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'left-employee',
    component: LeftEmployeeComponent,
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full',
  },
];
