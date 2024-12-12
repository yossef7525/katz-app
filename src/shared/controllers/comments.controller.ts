import { BackendMethod, remult } from "remult";
import { Roles } from "../types/roles";
import { Comment } from "../types";

export class CommentsController{
    @BackendMethod({ allowed: Roles.Admin , paramTypes: () => [Comment, Boolean, Boolean]})
    static async setCompleted(comment:Comment, completed:boolean, call:boolean) {
        const repo = remult.repo(Comment)
        comment.complate = completed
        await repo.save({...comment, ...(completed ? {inProgress: false} : {})})
        if(!call) return;
        try {
            fetch(`https://www.call2all.co.il/ym/api/RunCampaign?token=023137470:5386&templateId=40169&ttsMode=1&phones={"${comment.phoneUpdate}":"שלום זוהי הודעה מחברת גומלי חסד הפנייה ששלחת אלינו על ${comment.comment} טופלה בהצלחה במקרה הצורך שלח אלינו פנייה חדשה"}`)
        } catch (error) {
            console.log(error); 
        }
    }

    @BackendMethod({ allowed: Roles.Admin})
    static async sendNotificationCompleted(comment: Comment) {
        if(comment.complate) return;
        const repo = remult.repo(Comment)
        await repo.save(comment)
        try {
            fetch(`https://www.call2all.co.il/ym/api/RunCampaign?token=023137470:5386&templateId=40169&ttsMode=1&phones={"${comment.phoneUpdate}":"שלום זוהי הודעה מחברת גומלי חסד הפנייה ששלחת אלינו על ${comment.comment} נמצאת בטיפול"}`)
        } catch (error) {
            console.log(error); 
        }
    }
}