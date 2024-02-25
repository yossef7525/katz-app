import { NgModule } from "@angular/core";
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzToolTipModule } from "ng-zorro-antd/tooltip";
import { NzSpinModule } from "ng-zorro-antd/spin";
import { NzResultModule } from 'ng-zorro-antd/result';






const modules = [
    NzButtonModule,
    NzModalModule,
    NzTableModule,
    NzFormModule,
    NzInputModule,
    NzDividerModule,
    NzRadioModule,
    NzSelectModule,
    NzTagModule,
    NzMessageModule,
    NzLayoutModule,
    NzIconModule,
    NzMenuModule,
    NzCardModule,
    NzToolTipModule,
    NzSpinModule,
    NzResultModule

]

@NgModule({
    imports:[...modules],
    exports: [...modules]
})
export class NgZorroModule{}