import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import dayjs from 'dayjs';

@Component({
  selector: 'app-year-selector',
  templateUrl: './year-selector.component.html',
  styleUrls: ['./year-selector.component.scss']
})
export class YearSelectorComponent {

  @Output() dateRangeChanged: EventEmitter<Date[]> = new EventEmitter();
  dateSelectControl!: string;

  dateSelectChange(value: any) {
    const nextYear = Number(value) + 1
    this.dateRangeChanged.emit([dayjs(`${value}-1-1`).toDate(), dayjs(`${nextYear}-1-1`).toDate()]);
  }

}
