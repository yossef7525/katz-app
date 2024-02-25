import { Component, OnInit, TemplateRef } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { DistributesController } from '../../../shared/controllers/distributes.controller';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Distributes } from '../../../shared/types/distributes';
import { remult } from 'remult';

@Component({
  selector: 'app-distributes',
  templateUrl: './distributes.component.html',
  styleUrls: ['./distributes.component.scss'],
})
export class DistributesComponent implements OnInit {
  constructor(
    private modal: NzModalService,
    private messages: NzMessageService
  ) {}
  name: string = '';
  modalRef!: NzModalRef;
  loading:boolean = false;
  distributesActive!: Distributes[];
  distributesArchive!: Distributes[];
  repo = remult.repo(Distributes)
  async ngOnInit(): Promise<void> {
    this.loading = true;
    const distributes = await this.repo.find()
    this.distributesActive = distributes.filter(item=> !item.archive)
    this.distributesArchive = distributes.filter(item=> item.archive)
    this.loading = false;
  }
  createTplModal(
    tplTitle: TemplateRef<any>,
    tplContent: TemplateRef<void>
  ): void {
    this.modalRef = this.modal.create({
      nzTitle: tplTitle,
      nzContent: tplContent,
      nzFooter: null,
    });
  }
  async create() {
    if (!this.name) return;
    this.loading = true
    try {
     const newDistributes =  await DistributesController.createDistribute({
        name: this.name,
        archive: false,
      });
      this.distributesActive = [...this.distributesActive, newDistributes]
      this.loading = false
      this.messages.success('החלוקה נוצרה בהצלחה');
      this.modalRef.close();
      this.name = '';
    } catch (error) {
      this.messages.error('אריעה שגיאה, נסה שוב!');
    }
  }
 async confrimeMove(id?:string){
    this.modal.confirm({
      nzTitle: `האם אתה בטוח שברצונך לסיים חלוקה זו?`,
      nzOkText: 'כן',
      nzOkType: 'primary',
      nzOnOk: async () => await this.moveToArchive(id),
      nzCancelText: 'לא',
      nzOnCancel: () => {},
    })
  }
  async moveToArchive(id?:string) {
    if(!id) return;
    try {
      this.loading = true
      await DistributesController.moveToArchive(id)
      this.distributesArchive = [...this.distributesArchive, this.distributesActive.find(item => item.id === id) ?? {}]
      this.distributesActive = this.distributesActive.filter(item => item.id !== id)
      this.loading = false
      this.messages.success('החלוקה הועברה לארכיון');
    } catch (error) {
      this.messages.error('אריעה שגיאה, נסה שוב!');
    }
  }
}
