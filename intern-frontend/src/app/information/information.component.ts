import {Component, ViewEncapsulation} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {RouterLink} from "@angular/router";
import {Image} from 'primeng/image';

@Component({
  selector: 'app-information',
  imports: [ButtonModule, RouterLink, Image],
  standalone: true,
  templateUrl: './information.component.html',
  styleUrl: './information.component.css',
})
export class InformationComponent {

}
