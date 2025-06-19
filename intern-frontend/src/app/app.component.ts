// src/app/app.component.ts
import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NavbarComponent} from './navbar/component/navbar.component';
import {ButtonModule} from 'primeng/button';


@Component({
  selector: 'app-root',
  standalone: true,                // ← make it standalone!
  imports: [
    RouterModule,                  // brings in routerLink, routerLinkActive & router-outlet
    NavbarComponent,
    ButtonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']  // ← plural!
})
export class AppComponent {
  title = 'intern-frontend';
}
