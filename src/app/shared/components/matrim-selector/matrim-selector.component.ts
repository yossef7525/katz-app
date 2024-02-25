import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UsersService } from '../../../admin/services/users.service';
import { User } from '../../../../shared/types/user';

@Component({
  selector: 'app-matrim-selector',
  templateUrl: './matrim-selector.component.html',
  styleUrls: ['./matrim-selector.component.scss']
})
export class MatrimSelectorComponent implements OnInit{

  @Output() changeMatrimim:EventEmitter<string[]> = new EventEmitter();
  public matrimim!:User[]
  public selected!:string[]
  constructor(private readonly usersService:UsersService){}

  async ngOnInit(): Promise<void> {
   this.matrimim = await this.usersService.userRepo.find({where: {isMatrim: true}})
  }
  onChangeSelected(){
    this.changeMatrimim.emit(this.selected)
  }
}
