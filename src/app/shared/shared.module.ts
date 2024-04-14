import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserNamePipe } from './pipes/user-name.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersSelectorComponent } from './components/users-selector/users-selector.component';
// import { DateSelectorComponent } from './components/date-selector/date-selector.component';
// import { YearSelectorComponent } from './components/year-selector/year-selector.component';
import { NgZorroModule } from '../ng-zorro-module';
import { IsDeliveredPipe } from './pipes/is-deliveried.pipe';



@NgModule({
  declarations: [UserNamePipe, UsersSelectorComponent, IsDeliveredPipe],
  imports: [
    CommonModule,
    NgZorroModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[UserNamePipe, UsersSelectorComponent, IsDeliveredPipe]
})
export class SharedModule { }
