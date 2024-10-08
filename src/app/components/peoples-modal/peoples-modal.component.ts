import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PoepleService } from '../../services/poeple.service';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { People } from '../../../shared/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as XLSX from 'xlsx';
import { PeopleController } from '../../../shared/controllers/people.controller';
import { ReportService } from '../../services/reports.service';
import { CosherListOneLevel, CosherListTwoLevel } from '../../shared/types';

interface IModalData {
  people: People;
}

interface PeopleExcel extends People {
  phone: string;
  phone2: string;
  phone3: string;
}

@Component({
  selector: 'app-peoples-modal',
  templateUrl: './peoples-modal.component.html',
  styleUrls: ['./peoples-modal.component.scss'],
})
export class PeoplesModalComponent implements OnInit {
  public form!: FormGroup;
  readonly nzModalData: IModalData = inject(NZ_MODAL_DATA);
  constructor(
    private fb: FormBuilder,
    private peopleService: PoepleService,
    private nzModal: NzModalRef,
    private nzMessages: NzMessageService,
    private reportService: ReportService
  ) {}
cosherOneLevelOptions = CosherListOneLevel;
cosherTwoLevelOptions = CosherListTwoLevel;
  ngOnInit(): void {
    const {
      firstName,
      lastName,
      address,
      phones,
      building,
      floor,
      apartment,
      children,
      poultry,
      neighborhood,
      cosher,
      cosherListOneLevel,
      cosherListTwoLevel,
      poultryNextMonth
    } = this.nzModalData?.people || '';
    this.form = this.fb.group({
      firstName: [firstName || '', [Validators.required]],
      lastName: [lastName || '', [Validators.required]],
      address: [address || '', [Validators.required]],
      phone: [phones ? phones[0] : '', [Validators.required]],
      phone2: [phones ? phones[1] : '', [Validators.required]],
      phone3: [phones ? phones[2] : '', [Validators.required]],
      building: [building || '', [Validators.required]],
      floor: [floor || '', [Validators.required]],
      apartment: [apartment || '', [Validators.required]],
      children: [children || '', [Validators.required]],
      poultry: [poultry || '', [Validators.required]],
      neighborhood: [neighborhood || '', [Validators.required]],
      cosher: [cosher || '', [Validators.required]],
      cosherListOneLevel: [cosherListOneLevel, [Validators.required]],
      cosherListTwoLevel: [cosherListTwoLevel, [Validators.required]],
      poultryNextMonth: [poultryNextMonth || '', [Validators.required]],
    });
  }
  async submit() {
    const {
      firstName,
      lastName,
      address,
      phone,
      phone2,
      phone3,
      building,
      floor,
      apartment,
      children,
      poultry,
      neighborhood,
      cosher,
      cosherListOneLevel,
      cosherListTwoLevel,
      poultryNextMonth
    } = this.form.value;
    if (this.nzModalData) {
      await this.peopleService.repo.update(this.nzModalData.people.id, {
        firstName,
        lastName,
        address,
        floor,
        apartment,
        building,
        children,
        poultry,
        neighborhood,
        cosher,
        cosherListOneLevel,
        cosherListTwoLevel,
        poultryNextMonth,
        phones: [phone, phone2 ? phone2 : '', phone3 ? phone3 : ''],
      });
      this.nzMessages.success('העדכון בוצע בהצלחה');
      this.nzModal.close();
      return;
    }
    await this.peopleService.insert({
      firstName,
      lastName,
      address,
      floor,
      apartment,
      building,
      children,
      poultry,
      neighborhood,
      cosher,
      cosherListOneLevel,
      cosherListTwoLevel,
      poultryNextMonth,
      phones: [phone, phone2 ? phone2 : '', phone3 ? phone3 : ''],
    });
    this.nzMessages.success('העדכון בוצע בהצלחה');
    this.nzModal.close();
  }

  async onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>evt.target;
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
      const data = XLSX.utils.sheet_to_json(ws) as PeopleExcel[];

      // let obj:any[] = []
      data.forEach((row) => {
        (row.active = true),
        row.cosherListOneLevel = ((row.cosherListOneLevel as unknown as string)?.split(',') as string[])?.map(v => v.trim());
        row.cosherListTwoLevel = ((row.cosherListTwoLevel as unknown as string)?.split(',') as string[])?.map(v => v.trim());
          (row.phones = [
            `${row.phone[0] === '0' ? row.phone : '0' + row.phone}`,
            row.phone2 ? `${row.phone2[0] === '0' ? row.phone2 : '0' + row.phone2}` : '',
            row.phone3 ? `${row.phone3[0] === '0' ? row.phone3 : '0' + row.phone3}` : '',
          ]);
      });
      const res = await PeopleController.importPeopleFromExcelFile(data);
    };
    reader.readAsBinaryString(target.files[0]);

    this.nzModal.close();
  }
  async onUpdateFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>evt.target;
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
      const data = XLSX.utils.sheet_to_json(ws) as PeopleExcel[];

      // let obj:any[] = []
      data.forEach((row) => {
        row.cosherListOneLevel = ((row.cosherListOneLevel as unknown as string)?.split(',') as string[]).map(v => v.trim());
        row.cosherListTwoLevel = ((row.cosherListTwoLevel as unknown as string)?.split(',') as string[]).map(v => v.trim());
        (row.phones = [
          `${row.phone[0] === '0' ? row.phone : '0' + row.phone}`,
          row.phone2 ? `${row.phone2[0] === '0' ? row.phone2 : '0' + row.phone2}` : '',
          row.phone3 ? `${row.phone3[0] === '0' ? row.phone3 : '0' + row.phone3}` : '',
        ]);
      });
      const res = await PeopleController.updatePeopleFromExcelFile([...data]);
    };
    reader.readAsBinaryString(target.files[0]);

    this.nzModal.close();
  }
}
