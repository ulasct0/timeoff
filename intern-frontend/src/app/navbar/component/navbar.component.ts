import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {AuthService} from '../../credentials/service/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterModule,
  ],
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(public auth: AuthService) {
  }

  logout() {
    this.auth.logout();
  }
}
