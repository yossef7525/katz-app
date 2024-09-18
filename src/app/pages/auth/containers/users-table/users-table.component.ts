import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UserRoles } from '../../../../../shared/types/user-roles';
import { AddUserModalComponent } from '../../components/code-modal/add-user-modal.component';
import { remult } from 'remult';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit{
  private AuthRepo = remult.repo(UserRoles)
  list!:UserRoles[]
  constructor(private nzModal:NzModalService){}
  async ngOnInit(): Promise<void>{
     this.list = await this.AuthRepo.find()
  }
  openAddModal(){
    this.nzModal.create({
      nzContent: AddUserModalComponent,
      nzFooter: null
    })
  }
}
