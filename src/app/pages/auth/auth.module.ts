import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersTableComponent } from './containers/users-table/users-table.component';
import { AuthRoutes } from './auth.routing';
import { AddUserModalComponent } from './components/code-modal/add-user-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgZorroModule } from '../../ng-zorro-module';



@NgModule({
  declarations: [
    UsersTableComponent,
    AddUserModalComponent
  ],
  imports: [
    CommonModule,
    AuthRoutes,
    ReactiveFormsModule,
    NgZorroModule
  ]
})
export class AuthModule { }
