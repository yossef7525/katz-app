import { Component, OnInit, TemplateRef, ViewChild, computed, effect } from '@angular/core';
import { Comment, People } from '../../../shared/types';
import { CommentService } from '../../services/comment.service';
import { CommentsController } from '../../../shared/controllers/comments.controller';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PeoplesModalComponent } from '../../components/peoples-modal/peoples-modal.component';
import { PoepleService } from '../../services/poeple.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit{
  @ViewChild('selectTearetd') selectTearetd!: TemplateRef<HTMLElement>
  comments = computed(() => this.commentService.comments().filter(c => !c.complate))
  commentsComplete = computed(() => this.commentService.comments().filter(c => c.complate))
  treateds = ['חיים מאיר פרנקל', 'חיים וינגרטן', 'שלמה וינגרטן', 'אליעזר חשין']
  selectedTearetd = ''
  constructor(private commentService: CommentService, private peopleService:PoepleService, private nzMessage:NzMessageService, private nzModal:NzModalService) {}
  ngOnInit(): void {
    this.commentService.getComments()
  }
  confrimeCompleted(comment: Comment, completed: boolean){
    if(!completed){
      this.setCompleted(comment, completed, false)
    }
    this.nzModal.confirm({
      nzTitle: 'האם תרצה לשלוח צינתוק לבעל הפניה אודות סיום הטיפול בפניה?',
      nzOkText: 'כן',
      nzCancelText: 'לא',
      nzOnOk: ()=> this.setCompleted(comment, completed, true),
      nzOnCancel: () => this.setCompleted(comment, completed, false),
    })
  }
  confrimeDelete(comment: Comment){
    this.nzModal.confirm({
      nzTitle: 'האם אתה בטוח שתרצה למחוק את הפניה?',
      nzOkText: 'כן',
      nzCancelText: 'לא',
      nzOnOk: ()=> this.deleteComment(comment),
    })
  }
  async deleteComment(comment: Comment) {
    const msg = this.nzMessage.loading("הפעולה מתבצעת...")
    await this.commentService.deleteComment(comment)
    
    this.nzMessage.remove(msg.messageId)
    this.nzMessage.success('הפניה נמחקה בהצלחה.')
  }
  async setCompleted(comment: Comment, completed: boolean, call:boolean) {
    const msg = this.nzMessage.loading("הפעולה מתבצעת...")
    await CommentsController.setCompleted(comment, completed, call)
    this.ngOnInit()
    this.nzMessage.remove(msg.messageId)
    this.nzMessage.success('הפניה סומנה כטופל.')
  }
  async sendStartWorkNotification(comment:Comment){
    await this.commentService.sendStartWorkNotification(comment)
    this.nzMessage.success("הודעה על התחלת טיפול נשלחה בהצלחה")
    this.selectedTearetd = ''
  }

  confrimeStartWork(comment: Comment){
    this.nzModal.confirm({
      nzTitle: 'מי מטפל בפניה שבחרת?',
      nzContent: this.selectTearetd,
      nzOkText: 'שלח צינתוק',
      nzCancelText: 'ביטול',
      nzOnOk: () => {
        if(!this.selectedTearetd) {
          this.nzMessage.error("יש לבחור מי מטפל בפניה!")
          return;
        };
        this.sendStartWorkNotification({...comment, inProgress: true, treatedBy: this.selectedTearetd})
      },
    })
  }
 onSelectedTearetdChange(treated: string){
    this.selectedTearetd = treated
 }
  async openPeopleModalEditMode(peopleId: string) {
    const people = await this.peopleService.getPeopleById(peopleId)
    if(!people) return;
    this.nzModal.create({
      nzContent: PeoplesModalComponent,
      nzTitle: `פרטי נתמך (${peopleId})`,
      nzData: { people },
      nzFooter: null,
    });
  }
}
