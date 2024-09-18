import { Component, computed } from '@angular/core';
import { PoepleService } from '../../services/poeple.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PeoplesModalComponent } from '../../components/peoples-modal/peoples-modal.component';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { People } from '../../../shared/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ReportService } from '../../services/reports.service';

@Component({
  selector: 'app-peoples',
  templateUrl: './peoples.component.html',
  styleUrls: ['./peoples.component.scss'],
})
export class PeoplesComponent {
  total!: number;
  pageSize = 10;
  pageIndex = 1;
  searchToremId!: string[];
  constructor(
    public peopleService: PoepleService,
    private modal: NzModalService,
    private reportService:ReportService,
    private message: NzMessageService
  ) {
    this.peopleService.init(this.pageSize, this.pageIndex);
  }
  public peoples = computed(() => this.peopleService.poeples());

  async onQueryParamsChange(params: NzTableQueryParams): Promise<void> {
    const { pageSize, pageIndex } = params;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    await this.peopleService.init(this.pageSize, this.pageIndex,  this.searchToremId);
  }
  async onChangeUsersFilter(ids: string[]) {
    this.searchToremId = ids
    await this.peopleService.init(this.pageSize, this.pageIndex, this.searchToremId);
  }

  openPeopleModal() {
    this.modal.create({
      nzContent: PeoplesModalComponent,
      nzTitle: 'הוסף נתמך חדש למערכת',
      nzFooter: null,
    });
  }
  openPeopleModalEditMode(people: People) {
    this.modal.create({
      nzContent: PeoplesModalComponent,
      nzTitle: 'ערוך פרטי נתמך',
      nzData: { people },
      nzFooter: null,
    });
  }

  async setActiveUser(active: boolean, i: number) {
    const m = this.message.loading('הפעולה מתבצעת...');
    const people = this.peoples()?.at(i)
    if(!people) return;
    await this.peopleService.repo.update(people.id, { active });
    this.message.remove(m.messageId);
    this.message.success(active ? 'המשתמש הופעל בהצלחה' : 'המשתמש הוגדר כלא פעיל בהצלחה');
  }
  async exportToExcel(forUpdate?:boolean) {
    const m = this.message.loading('מתבצע יצוא נתמכים לקובץ אקסל, אנא המתן להשלמת הפעולה!');
    const res = await this.peopleService.repo.find({
      limit: 10000,
      orderBy: {order: 'asc'},
    });

    this.message.remove(m.messageId);
    this.message.success('הפעולה הושלמה בהצלחה!');

    const heading = [['שם פרטי', 'שם משפחה', 'שכונה', 'כתובת', 'בנין', 'קומה', 'דירה', 'טלפון', 'ילדים', 'עופות', 'כשרות']];
    const fileName = 'נתמכים גומלי חסד.xlsx';
    const sheetName = 'נתמכים';
    if(forUpdate) {
      const users = res.map(row => {return {...row, cosherListOneLevel: row.cosherListOneLevel?.join(','),cosherListTwoLevel: row.cosherListTwoLevel?.join(','), phone: row.phones[0], phone2: row.phones[1], phone3: row.phones[2] }})
      const keys = Object.keys(users[0])
      this.reportService.createExcelFile([keys], users, fileName, sheetName);
      return
    }
    const users = res.map(({ firstName, lastName, neighborhood, address, building,floor, apartment, phones, children, poultry, cosher  }) => ({
      firstName, lastName, neighborhood, address, building,floor, apartment,  phones: phones ? phones[0] : '', children, poultry, cosher}));
      this.reportService.createExcelFile(heading, users, fileName, sheetName);
  }
}
