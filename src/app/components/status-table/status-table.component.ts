import { Component, Input } from '@angular/core';
import { Deliveries } from '../../../shared/types';

@Component({
  selector: 'app-status-table',
  templateUrl: './status-table.component.html',
  styleUrls: ['./status-table.component.scss']
})
export class StatusTableComponent {
  @Input() data!:Deliveries['status']
}
