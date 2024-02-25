import { Component, OnInit } from '@angular/core';
import { People } from '../../../shared/types';
import { remult } from 'remult';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SortedController } from '../../../shared/controllers/sorted.controller';

@Component({
  selector: 'app-sorted',
  templateUrl: './sorted.component.html',
  styleUrls: ['./sorted.component.scss']
})
export class SortedComponent implements OnInit{
  constructor(private nzMessages:NzMessageService){}
  peoples!:People[]
  loading:boolean = false
  peopleRepo = remult.repo(People)
  async ngOnInit(): Promise<void> {
    this.loading = true
    this.peoples = (await this.peopleRepo.find()).sort((a,b) => (a.order||0) - (b.order || 0))
    this.loading = false
  }

  drop(event: CdkDragDrop<People[]>) {
    moveItemInArray(this.peoples, event.previousIndex, event.currentIndex);
  }
  move(previousIndex:number, currentIndex:string) {
    const currentIndexNumber = Number(currentIndex)
    moveItemInArray(this.peoples, previousIndex, currentIndexNumber);
  }
  async update(){
    const orderedList = this.peoples.map(({id}, i) => ({id, order: i}))
    try {
      this.loading = true
      this.nzMessages.loading("העדכון מתבצע, אנא המתן להודעת אישור!")
      const res = await SortedController.updateSorted(orderedList)
      this.nzMessages.success("העדכון בוצע בהצלחה!")
      this.loading = false
    } catch (error) {
      this.nzMessages.error('העדכון נכשל, אנא נסה שוב!')
    }
  }
}
