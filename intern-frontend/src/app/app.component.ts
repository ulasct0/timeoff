// src/app/app.component.ts
import {Component, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NavbarComponent} from './navbar/component/navbar.component';
import {PrimeNG} from 'primeng/config';


@Component({
  selector: 'app-root',
  standalone: true,                // ← make it standalone!
  imports: [
    RouterModule,                  // brings in routerLink, routerLinkActive & router-outlet
    NavbarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']  // ← plural!
})
export class AppComponent implements OnInit {

  constructor(private primeng: PrimeNG) {
  }

  ngOnInit() {
    this.primeng.ripple.set(true);
  }
}
