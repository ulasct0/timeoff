// src/app/app.component.ts
import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterModule} from '@angular/router';
import {NavbarComponent} from './navbar/component/navbar.component';
import {ButtonModule} from 'primeng/button';
import {filter} from 'rxjs';
import {NgIf} from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,                // ← make it standalone!
  imports: [
    RouterModule,                  // brings in routerLink, routerLinkActive & router-outlet
    NavbarComponent,
    ButtonModule,
    NgIf
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']  // ← plural!
})
export class AppComponent implements OnInit {
  showNavbar = false;

  constructor(private router: Router) {
    // subscribe to route changes
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.updateNavVisibility());
  }

  ngOnInit() {
    // on app start, if they already have a session, jump to /home
    if (sessionStorage.getItem('employeeId')) {
      this.router.navigate(['/dashboard']);
    }
    // also set the initial navbar visibility
    this.updateNavVisibility();
  }

  private updateNavVisibility() {
    const isLoginRoute = this.router.url === '/login';
    const isLoggedIn = !!sessionStorage.getItem('employeeId');
    this.showNavbar = isLoggedIn && !isLoginRoute;
  }
}
