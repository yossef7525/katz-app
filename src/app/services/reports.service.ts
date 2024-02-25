import { Injectable } from "@angular/core";
import * as XLSX from 'xlsx';

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
}