import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeliveriesService } from '../../services/deliveries.service';
import { Deliveries, Statuses } from '../../../shared/types';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import * as XLSX from 'xlsx';

interface IModalData {
  deliverie:Deliveries
}
type AOA = any[][];

@Component({
  selector: 'app-deliveries-modal',
  templateUrl: './deliveries-modal.component.html',
  styleUrls: ['./deliveries-modal.component.scss'],
})
export class DeliveriesModalComponent implements OnInit {
  public form!: FormGroup;
  readonly nzModalData: IModalData = inject(NZ_MODAL_DATA);
  constructor(private fb: FormBuilder, private deliveriesService: DeliveriesService, private modalRef:NzModalRef) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      peopleId: [this.nzModalData?.deliverie.peopleId || '', [Validators.required]],
      status: ['', [Validators.required]]
    });
  }
  async submit() {
    if(!this.form.valid) return;
    const {peopleId, status} = this.form.value;

    if(this.nzModalData?.deliverie){
      const shipping = (await this.deliveriesService.repo.find({where: {id: this.nzModalData.deliverie.id}}))[0]
      if(shipping.status.findIndex(s => s.status === status) > -1) {
        alert('סטטוס המשלוח כבר עודכן')
        return
      }
      shipping.status = [
        {
            createdAt:new Date(), 
            status: status, 
            updatePhone: 'אתר'
        }, ...(shipping.status || [])]
      shipping.peopleId = peopleId

      await this.deliveriesService.repo.save(shipping)
      this.modalRef.close();
      return
    }
    await this.deliveriesService.insert({
     peopleId,
     status: [{status, updatePhone: 'אתר', createdAt: new Date()}],
    });
    this.modalRef.close()
  }
  onChangeUserSelector(users:string){
    this.form.get('peopleId')?.setValue(users)
  }

  async onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = async (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      const data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      let obj:any[] = []
      data.forEach(row => {
        obj = [...obj, {peopleId: row[0], id: row[1], status: [{status: Statuses.Absorbed, updatePhone: 'אתר', createdAt: new Date()}]}]
      })
      console.log(obj);
     const res = await this.deliveriesService.repo.insert(obj)
      // this.deliveriesService.deliveries.update((deliveries:Deliveries[]) => [...deliveries, ...res])
      this.modalRef.close()
    };
    reader.readAsBinaryString(target.files[0]);
  }
}
