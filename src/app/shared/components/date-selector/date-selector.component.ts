import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
// import  dayjs from 'dayjs';

@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.scss']
})
export class DateSelectorComponent {
  @Input() startDate!: Date;
  @Input() endDate!: Date;
  @Output() dateRangeChanged: EventEmitter<Date[]> = new EventEmitter();
  dateRangeControl!: Date[];
  dateSelectControl!: string;

  ngOnInit(): void {
    const startDate = this.startDate || dayjs().subtract(1, 'day').startOf('day').toDate();
    const endDate = this.endDate || new Date();
    const value = [startDate, endDate];
    this.dateRangeControl = value;
    this.dateSelectControl = '7:day'
    this.dateRangeChanged.emit(value);

    // this.dateRangeControl.valueChanges.subscribe(value => {
    //   this.dateRangeChanged.emit(value);
    // });

    // this.dateSelectControl.valueChanges.subscribe(value => {
      // });
    }
    dateSelectChange(value:any){
        const [number, unit] = value.split(':');
        const date = dayjs().subtract(parseInt(number), unit);
        this.dateRangeControl = [date.toDate(), dayjs().toDate()]
        this.dateRangeChanged.emit([date.toDate(), dayjs().toDate()]);
  }
  dateRangeChange(value:Date[]){
        this.dateRangeControl = value
        this.dateRangeChanged.emit(value);
  }
}
