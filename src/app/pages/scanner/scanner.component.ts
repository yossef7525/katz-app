import { Component, HostListener } from '@angular/core';
import { PoepleService } from '../../services/poeple.service';
import { PeoplesModalComponent } from '../../components/peoples-modal/peoples-modal.component';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent {
  constructor(private peopleService:PoepleService,private nzModal:NzModalService ) { }
  public lastScanned!: { code: string, times: number };
  private code: string = '';
  loading = false;


  @HostListener('window:keypress', ['$event'])
  protected keyEvent(event: KeyboardEvent): void {
    if (event.key === 'A') {
      if (this.lastScanned?.code === this.code) {
        this.lastScanned.times++;
      } else {
        this.lastScanned = {
          code: this.code,
          times: 1
        };
      }
      console.log(this.code);
      this.openPeopleModalEditMode(this.code);
      this.code = '';
    } else {
      this.code += event.key;
    }
  }
  async openPeopleModalEditMode(peopleId: string) {
    this.loading = true;
    const people = await this.peopleService.getPeopleById(peopleId)
    this.loading = false;
    if(!people) {
      alert('לא נמצא נתמך עם הקוד הזה');
      return;
    };
    this.nzModal.create({
      nzContent: PeoplesModalComponent,
      nzTitle: `פרטי נתמך (${peopleId})`,
      nzData: { people },
      nzFooter: null,
    });
  }
}
