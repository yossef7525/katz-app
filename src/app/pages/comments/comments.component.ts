import { Component, OnInit, computed, effect } from '@angular/core';
import { Comment } from '../../../shared/types';
import { CommentService } from '../../services/comment.service';
import { CommentsController } from '../../../shared/controllers/comments.controller';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit{
  comments = computed(() => this.commentService.comments().filter(c => !c.complate))
  commentsComplete = computed(() => this.commentService.comments().filter(c => c.complate))
  constructor(private commentService: CommentService, private nzMessage:NzMessageService) {}
  ngOnInit(): void {
    this.commentService.getComments()
  }
  async setCompleted(comment: Comment, completed: boolean) {
    const msg = this.nzMessage.loading("הפעולה מתבצעת...")
    await CommentsController.setCompleted(comment, completed)
    this.nzMessage.remove(msg.messageId)
    this.nzMessage.success('הפניה סומנה כטופל, צינתוק נשלח לבעל הפניה.')
  }
  sendStartWorkNotification(comment:Comment){
    CommentsController.sendNotificationCompleted(comment)
    this.nzMessage.success("הודעה על התחלת טיפול נשלחה בהצלחה")
  }
}
