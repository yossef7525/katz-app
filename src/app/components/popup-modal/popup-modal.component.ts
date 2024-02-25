import { Component, Input, OnInit } from '@angular/core';
import { Deliveries } from '../../../shared/types';

@Component({
  selector: 'app-popup-modal',
  templateUrl: './popup-modal.component.html',
  styleUrls: ['./popup-modal.component.scss']
})
export class PopupModalComponent implements OnInit{
  @Input() delivery!:Deliveries
  ngOnInit(): void {
      const audio = new Audio('assets/success.mp3');
      audio.play()
  }
}
