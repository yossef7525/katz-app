import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { People } from '../../../../shared/types';
import { PoepleService } from '../../../services/poeple.service';

@Component({
  selector: 'app-users-selector',
  templateUrl: './users-selector.component.html',
  styleUrls: ['./users-selector.component.scss']
})
export class UsersSelectorComponent implements OnInit {
  @Output() changeUsers: EventEmitter<string[]> = new EventEmitter();
  public users!: People[]
  public selected!: string[]
  public isLoading!: boolean
  constructor(private readonly usersService: PoepleService) { }
  async ngOnInit(): Promise<void> {
    // this.isLoading = true
    // this.users = await this.usersService.userRepo.find({ where: { group: { $ne: '' } }, orderBy: { lastName: 'asc' }, limit: 20 })
    // this.isLoading = false
  }
  async onSearch(value: string) {
    
    this.isLoading = true
    this.users = await this.usersService.repo.find({
      orderBy: { lastName: 'asc' , firstName: 'asc'},
      where: {$or: [{id: value}, {firstName: {$contains: value}}, {lastName: {$contains: value}}]},
      limit: 20
    })
    this.isLoading = false
  }
  onChangeSelected(){
    this.changeUsers.emit(this.selected)
  }
}
