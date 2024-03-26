import { Injectable } from "@angular/core";
import * as XLSX from 'xlsx';
import { PeopleExcel } from "../../shared/types";

@Injectable({
    providedIn: 'root'
})
export class ReportService {

    createExcelFile(headers: any[], data: object[], fileName: string, sheetName: string) {
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        const ws: XLSX.WorkSheet = XLSX.utils.sheet_add_aoa(wb, headers);

        XLSX.utils.sheet_add_json(wb, data, { origin: 'A2', skipHeader: true });

        if (!wb.Workbook) wb.Workbook = {};
        if (!wb.Workbook.Views) wb.Workbook.Views = [];
        if (!wb.Workbook.Views[0]) wb.Workbook.Views[0] = {};
        wb.Workbook.Views[0].RTL = true;
        XLSX.utils.book_append_sheet(wb, ws, sheetName);

        XLSX.writeFile(wb, fileName);
    }

    uploadPeoplesFromExcel(evt:any) : PeopleExcel[]{
            /* wire up file reader */
            let res:PeopleExcel[] = []
            const target: DataTransfer = <DataTransfer>(evt.target);
            if (target.files.length !== 1) throw new Error('Cannot use multiple files');
            const reader: FileReader = new FileReader();
            reader.onload = (e: any) => {
              /* read workbook */
              const bstr: string = e.target.result;
              const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        
              /* grab first sheet */
              const wsname: string = wb.SheetNames[0];
              const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        
              /* save data */
              const data = XLSX.utils.sheet_to_json(ws) as PeopleExcel[];
              
              // let obj:any[] = []
              data.forEach(row => {
                row.active = true,
                row.phones = [`0${row.phone}`, (row.phone2 ? `0${row.phone2}` : ''),(row.phone3 ? `0${row.phone3}` : '')]
              })
              res = [...data]
            };
            reader.readAsBinaryString(target.files[0]);
            return res
    }
}