import { remult } from "remult";
import {  Comment, Deliveries, People, Statuses } from "../shared/types";
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
        `להלן הפרטים כפי שמעודכנים במערכת: קוד אישי: ${people.id}: שם: ${people.firstName} ${people.lastName}: כתובת: ${people.address}: בנין: ${people.building} קומה: ${people.floor.replaceAll('-', ' מינוס ')}: דירה: ${people.apartment}: מספר ילדים: ${people.children}: מספר עופות: ${people.poultry}: כשרות: ${people.cosher}: אלו הפרטים שמעודכנים אצלינו במידה וחלק מהפרטים לא נכונים אנא עדכן אותנו בהקדם`
        return call.id_list_message([{type: 'text',removeInvalidChars: true,data: message}])
})

router.get('/deliveryDetails', async(call) => {
    const ApiPhone = call.ApiPhone
    const repo = remult.repo(People)
    const deliveries = remult.repo(Deliveries)
    const comments = remult.repo(Comment)
    const people = (await repo.find({where:{phones: {$contains: ApiPhone}, active: true}})).at(0)

    if(!people){
        return call.id_list_message([{type: 'text', data: `אנו מצטערים, אינכם מופיעים ברשימת הזכאות לקבלת עופות`}])

    }
    const packInStack = (await deliveries.find({where:{peopleId: people?.id}})).at(0)

    if(!packInStack){
        return call.id_list_message([{type: 'text',removeInvalidChars: true, data: `הנך זכאי לקבל בחלוקה הקרובה ${people?.poultry} עופות`}])
    }
    if(packInStack.status.length === 1){
        return call.id_list_message([{type: 'text', removeInvalidChars: true, data: `המשלוח שלך הכולל ${packInStack.count} עופות, אושר, החלוקה תתחיל בימים הקרובים, ניתן להתעדכן בשלוחה 1` }])
    }
    const packIsDelivered = packInStack.status.findIndex(s => s.status === Statuses.Delivered) > -1
    const message = packIsDelivered ?
    `המשלוח שלך הכולל ${packInStack.count} עופות - הגיע אליך הביתה` : 
    `המשלוח שלך הכולל ${packInStack.count} עופות - נמצא אצליך בבנין`  

    const lavel = await call.read([{type: 'text',removeInvalidChars: true, data: message}, {type: 'text',removeInvalidChars: true, data: 'אם לא קיבלת את המשלוח לחץ 1, אם קיבלת יותר עופות לחץ 2, אם קיבלת פחות עופות לחץ 3'}], 'tap') 
    switch (lavel) {
        case '1':
            await comments.insert({
                peopleId: people?.id,
                phoneUpdate: ApiPhone,
                comment: 'לא קיבל עופות',
                payload: [{key: 'כמות עופות', value: `${packInStack.count}`}] 
            })
            return call.id_list_message([{type: 'text',removeInvalidChars: true, data: 'אנו מצטערים, המידע בבדיקה, אנו ניצור עמכם קשר'}])
            case '2' :
                case '3' :
                    const count = await call.read([{type: 'text', data: 'הקש כמות'}], 'tap')
                    await comments.insert({
                        peopleId: people?.id,
                        phoneUpdate: ApiPhone,
                        comment: lavel === '2' ? 'קיבל יותר עופות' : 'קיבל פחות עופות',
                        payload: [{key: 'כמות עופות', value: count}] 
                    })
                    return call.id_list_message([{type: 'text',removeInvalidChars: true, data: 'אנו מצטערים, המידע בבדיקה, אנו ניצור עמכם קשר'}])
        default:
            break;
    }
})

// עדכון סטטוס הגיע לבנין
router.get('/Building', async (call) => {
    try {
        const ApiPhone = call.ApiPhone
        const repo = remult.repo(Deliveries)

        const packId = await call.read([{data: 'אנא הקש מספר משלוח', type: 'text'}], "tap")

        const shipping =  (await repo.find({where: {id: packId}}))[0]

        if(!shipping) {
            return call.id_list_message([{type: 'text',data: 'מספר משלוח שגוי'},{type: 'go_to_folder', data: '/8/1'}]);
        } else if (shipping.status.findIndex(s => s.status === Statuses.Building) > -1) {
            return call.id_list_message([{type: 'text', data: 'הסטטוס כבר עודכן'},{type: 'go_to_folder',data: '/8/1'}]);
        }

        shipping.status = [
            {
                createdAt:new Date(), 
                status: Statuses.Building, 
                updatePhone: ApiPhone
            }, ...(shipping.status || [])]

        shipping.updatePhone = ApiPhone
       
        await repo.save(shipping)
        return call.id_list_message([{type: 'text', data: 'בוצע'},{type: 'go_to_folder', data: '/8/1'}]);
    } catch {
        return call.id_list_message([{type: 'text', data: 'שגיאה'},{type: 'go_to_folder', data: '/8/1'}]);
    }
})

export default router

