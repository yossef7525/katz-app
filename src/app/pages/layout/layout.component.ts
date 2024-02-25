import { Component } from '@angular/core';
import { remult } from 'remult';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  isCollapsed:boolean = false
  remult = remult
}
