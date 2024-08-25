import { Injectable, signal } from "@angular/core";
import { remult } from "remult";
import { Comment } from "../../shared/types";

@Injectable({ providedIn: 'root' })
export class CommentService {
    constructor() { }
    private repo = remult.repo(Comment)
    public comments = signal<Comment[]>([])
    async getComments(): Promise<Comment[]> {
        const comments = await this.repo.find({ where: { isDeleted: false } });
        this.comments.set(comments)
        return comments;
    }

    async setCompleted(comment: Comment, completed: boolean) {
        comment.complate = completed;
        await this.repo.save(comment)
        this.comments.set(await this.repo.find({ where: { isDeleted: false } }))
    }
    async deleteComment(comment: Comment) {
        comment.isDeleted = true;
        await this.repo.save(comment)
        this.comments.set(await this.repo.find({ where: { isDeleted: false } }))
    }

}