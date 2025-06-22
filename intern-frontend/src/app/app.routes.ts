import {Routes} from '@angular/router';
import {EmployeeListComponent} from './employee-list/component/employee-list.component';
import {TimeoffComponent} from './timeoff/component/timeoff.component.';
import {TimeoffListComponent} from './timeoff-list/component/timeoff-list.component';
import {HomeComponent} from './home/home.component';
import {ProfileComponent} from './profile/profile.component';

export const routes: Routes = [
  {
    path: 'employee-list',
    component: EmployeeListComponent,
  },
  {
    path: 'timeoff',
    component: TimeoffComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'timeoff-list',
    component: TimeoffListComponent,
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  }
];
