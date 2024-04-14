import { Component, computed } from '@angular/core';
import { PoepleService } from '../../services/poeple.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PeoplesModalComponent } from '../../components/peoples-modal/peoples-modal.component';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { DeliveriesService } from '../../services/deliveries.service';
import { DeliveriesModalComponent } from '../../components/deliveries-modal/deliveries-modal.component';
import { Deliveries, Statuses } from '../../../shared/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ReportService } from '../../services/reports.service';
import { DistributesController } from '../../../shared/controllers/distributes.controller';
import { remult } from 'remult';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss'],
})
export class DeliveriesComponent {
  total!: number;
  pageSize = 10;
  pageIndex = 1;
  statusesList = Statuses
  loading = false
  searchToremId!: string[];
  query!:string;
  statusFilter?:Statuses
  statusToUpdate!:Statuses
  inProcessOnly!:boolean
  remult = remult
  
  constructor(
    public deliveriesService: DeliveriesService,
    private modal: NzModalService,
    private reportService:ReportService,
    private message:NzMessageService
  ) {
    this.deliveriesService.init(this.pageSize, this.pageIndex);
    
  }
  // public deliveries = computed(() => this.deliveriesService.deliveries());
  
  async onQueryParamsChange(params: NzTableQueryParams): Promise<void> {
    this.loading = true
    const { pageSize, pageIndex } = params;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    await this.deliveriesService.init(this.pageSize, this.pageIndex, this.searchToremId, this.query, this.statusFilter, this.inProcessOnly);
    this.loading = false
  }
  async onChangeUsersFilter(ids: string[]) {
    this.searchToremId = ids
    await this.deliveriesService.init(this.pageSize, this.pageIndex, this.searchToremId, this.query), this.statusFilter, this.inProcessOnly;
  }
  async onChangeQueryFilter(query: string) {
    this.query = query
    await this.deliveriesService.init(this.pageSize, this.pageIndex, this.searchToremId, this.query, this.statusFilter, this.inProcessOnly);
  }
  openDeliveriesModal() {
    this.modal.create({
      nzContent: DeliveriesModalComponent,
      nzTitle: 'הוסף משלוח חדש למערכת',
      nzFooter: null,
    });
  }
  update(deliverie:Deliveries){
    this.modal.create({
      nzContent: DeliveriesModalComponent,
      nzData: {deliverie},
      nzTitle: 'הוסף משלוח חדש למערכת',
      nzFooter: null,
    });
  }

  async exportToExcel() {
    const m = this.message.loading('מתבצע יצוא מדבקות לקובץ אקסל, אנא המתן להשלמת הפעולה!');
    const res = await this.deliveriesService.repo.find({
      limit: 10000,
      orderBy: {id: 'asc'},
      include: {people: true}
    });

    this.message.remove(m.messageId);
    this.message.success('הפעולה הושלמה בהצלחה!');

    const heading = [['מספר משלוח','שם פרטי', 'שם משפחה', 'שכונה', 'כתובת', 'בנין', 'קומה', 'דירה', 'עופות', 'כשרות', 'טלפון צינתוק']];
    const fileName = 'מדבקות למשלוחים.xlsx';
    const sheetName = 'משלוחים';
    const users = res.map(({ id, count, people  }) => ({
      id,
      firstName: people?.firstName, 
      lastName: people?.lastName, 
      neighborhood: people?.neighborhood, 
      address: people?.address, 
      building: people?.building,
      floor: people?.floor, 
      apartment: people?.apartment, 
      poultry: count, 
      cosher: people?.cosher,
      phone: people?.phones[0]
    }));
    this.reportService.createExcelFile(heading, users, fileName, sheetName);
  }

  async updateManyStatus(){
    try {
      this.message.loading("הפעולה מתבצעת, אנא המתן...")
      await DistributesController.updateStatusMany({
        where: {...(this.searchToremId?.length ? { peopleId: { $in: this.searchToremId } } : {}), ...(this.query ? { id: this.query } : {}) , ...(this.statusFilter ? {...Deliveries.statusFilter({query:this.statusFilter})} : {}), ...(this.inProcessOnly ? {...Deliveries.filterNotDeliveries()} : {})},
        statusToUpdate:this.statusToUpdate
      })
      this.message.success("הפעולה הושלמה בהצלחה")
    } catch (error) {
      this.message.error("אירעה שגיאה, נסה שוב")
      console.error(error);
    }
  }
 async setDeliverie(deliverie:boolean, index:number){
    try {
      this.message.loading("הפעולה מתבצעת, אנא המתן...")
      await DistributesController.setDeliveried({isDeliveried: deliverie, id: this.deliveriesService.deliveries[index].id})
      this.message.success("הפעולה הושלמה בהצלחה")
    } catch (error) {
      this.message.error("אירעה שגיאה, נסה שוב")
      console.error(error);
    }
  }
}
