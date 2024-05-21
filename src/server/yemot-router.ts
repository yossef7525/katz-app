import { remult } from "remult";
import {  People } from "../shared/types";
import { YemotRouter } from 'yemot-router2';
const router = YemotRouter();


router.get('/details', async (call)=> {
    const ApiPhone = call.ApiPhone
    const repo = remult.repo(People)
    const people = (await repo.find({where:{phones: {$contains: ApiPhone}}})).at(0)
        const message = !people ? 
        'מספר טלפון לא קיים במערכת'
        :
        `להלן הפרטים כפי שמעודכנים במערכת: שם: ${people.firstName} ${people.lastName}: כתובת: ${people.address}: בנין: ${people.building} קומה: ${people.floor.replaceAll('-', ' מינוס ')}: דירה: ${people.apartment}: מספר ילדים: ${people.children}: מספר עופות: ${people.poultry}: כשרות: ${people.cosher}: אלו הפרטים שמעודכנים אצלינו במידה וחלק מהפרטים לא נכונים אנא עדכן אותנו בהקדם.`
        return call.id_list_message([
            {
                type: 'text',
                data: message
            }
    ])
})
export default router