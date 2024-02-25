import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import {  NzModalRef } from 'ng-zorro-antd/modal';
import { AuthController } from '../../../../../shared/controllers/auth.controller';

@Component({
  selector: 'add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.scss']
})
export class AddUserModalComponent implements OnInit {

  public form!: FormGroup
  public loading: boolean = false;

  constructor(private fb: FormBuilder, private messageServise: NzMessageService, private modal:NzModalRef) { }

  ngOnInit(): void {
    
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      password: ['', [Validators.required]],
      roles: []
    })
  }
  async submit() {

    if (!this.form.valid) return

    const { name, password, matrimId, roles } = this.form.value
    try {
      this.loading = true
     
      await AuthController.insertUser(name, password, roles ? roles : []) 
      this.messageServise.success('העדכון בוצע בהצלחה');
      this.loading = false
      this.modal.close()
    } catch (error) {
      this.messageServise.error('המידע לא התעדכן, אנא נסה שוב!');
      console.error(error);
    }
  }
}
