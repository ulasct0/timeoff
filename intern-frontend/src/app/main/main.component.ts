import {Component} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {RouterLink} from '@angular/router';
import {Image} from 'primeng/image';

@Component({
  selector: 'app-main',
  imports: [
    ButtonModule,
    RouterLink,
    Image
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
