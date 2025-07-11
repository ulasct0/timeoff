import {Routes} from '@angular/router';
import {EmployeeListComponent} from './employee-list/component/employee-list.component';
import {TimeoffListComponent} from './timeoff-list/component/timeoff-list.component';
import {ProfileComponent} from './profile/component/profile.component';
import {LoginComponent} from './login/component/login.component';
import {DashboardComponent} from './dashboard/component/dashboard.component';

export const routes: Routes = [
  {
    path: 'employee-list',
    component: EmployeeListComponent,
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
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '**',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];
