import { remult } from "remult";
import {  Deliveries, People, Statuses } from "../shared/types";
import { YemotRouter } from 'yemot-router2';
import YemotUtils from "./yemot-utils";
const router = YemotRouter();

// שמיעת פרטים אישיים
router.get('/details', async (call)=> {
    const ApiPhone = call.ApiPhone
    const repo = remult.repo(People)
    const people = (await repo.find({where:{phones: {$contains: ApiPhone}}})).at(0)
        const message = !people ? 
        'מספר טלפון לא קיים במערכת'
        :
        `להלן הפרטים כפי שמעודכנים במערכת: שם: ${people.firstName} ${people.lastName}: כתובת: ${people.address}: בנין: ${people.building} קומה: ${people.floor.replaceAll('-', ' מינוס ')}: דירה: ${people.apartment}: מספר ילדים: ${people.children}: מספר עופות: ${people.poultry}: כשרות: ${people.cosher}: אלו הפרטים שמעודכנים אצלינו במידה וחלק מהפרטים לא נכונים אנא עדכן אותנו בהקדם`
        return call.id_list_message([
            {
                type: 'text',
                data: message
            }
    ])
})

router.get('/Building', async (call) => {
    try {
        const ApiPhone = call.ApiPhone
        const repo = remult.repo(Deliveries)

        const packId = await call.read([{data: 'אנא הקש מספר משלוח', type: 'text'}], "tap")
        const shipping =  (await repo.find({where: {id: packId}}))[0]

        if(!shipping) {
            return call.id_list_message([
                {
                    type: 'text',
                    data: 'מספר משלוח שגוי'
                },
                {
                    type: 'go_to_folder',
                    data: '/8/1'
                }
            ]);
        } else if (shipping.status.findIndex(s => s.status === Statuses.Building) > -1) {
            return call.id_list_message([
                {
                    type: 'text',
                    data: 'הסטטוס כבר עודכן'
                },
                {
                    type: 'go_to_folder',
                    data: '/8/1'
                }
            ]);
        }

        shipping.status = [
            {
                createdAt:new Date(), 
                status: Statuses.Building, 
                updatePhone: ApiPhone
            }, ...(shipping.status || [])]

        shipping.updatePhone = ApiPhone
       
        await repo.save(shipping)
        return call.id_list_message([
            {
                type: 'text',
                data: 'בוצע'
            },
            {
                type: 'go_to_folder',
                data: '/8/1'
            }
        ]);
    } catch {
        return call.id_list_message([
            {
                type: 'text',
                data: 'שגיאה'
            },
            {
                type: 'go_to_folder',
                data: '/8/1'
            }
        ]);
    }
})
export default router