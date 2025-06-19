import {Routes} from '@angular/router';
import {EmployeeListComponent} from './employee-list/component/employee-list.component';
import {TimeoffComponent} from './timeoff/component/timeoff.component.';
import {TimeoffListComponent} from './timeoff-list/component/timeoff-list.component';

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
    path: '',
    component: TimeoffListComponent,
  },
  {
    path: 'timeoff-list',
    component: TimeoffListComponent,
  }
];
