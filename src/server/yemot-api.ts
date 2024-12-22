import { Router } from "express";
import {api} from './api';
import { remult } from "remult";
import { Deliveries, People, Statuses } from "../shared/types";
import fs from 'fs/promises';
import { set } from "lodash";

const YemotRouts = Router();



YemotRouts.get('/details', api.withRemult, async (req, res)=> {
    const ApiPhone= `${req.query['ApiPhone']}`
    const repo = remult.repo(People)
    const people = (await repo.find({where:{phones: {$contains: ApiPhone}}})).at(0)
    if(!people) {
        res.send("id_list_message=t-מספר טלפון לא קיים במערכת.&go_to_folder=/")
    } else {
        const message = `id_list_message=t-להלן הפרטים כפי שמעודכנים במערכת: שם: ${people.firstName} ${people.lastName}: קוד אישי: ${people.id}: כתובת: ${people.address}: בנין: ${people.building} קומה: ${people.floor.replaceAll('-', ' מינוס ')}: דירה: ${people.apartment}: מספר ילדים: ${people.children}: מספר עופות: ${people.poultry}: כשרות: ${people.cosher}: אלו הפרטים שמעודכנים אצלינו במידה וחלק מהפרטים לא נכונים אנא עדכן אותנו בהקדם.`
        res.send(message)
    }
})

// הגיע לבנין 8.1
YemotRouts.get('/Building', api.withRemult, async (req, res) => {
    try {
        const [packId, ApiPhone] = [`${req.query['packId']}`, `${req.query['ApiPhone']}`]
        const repo = remult.repo(Deliveries)
        const shipping =  (await repo.find({where: {id: packId}}))[0]

        if(!shipping) {
            res.send("id_list_message=t-מספר משלוח שגוי.&go_to_folder=/8/1"); 
            return;
        } else if (shipping.status.findIndex(s => s.status === Statuses.Building) > -1) {
            res.send("id_list_message=t-הסטטוס כבר עודכן.&go_to_folder=/8/1");
            return;
        }

        shipping.status = [
            {
                createdAt:new Date(), 
                status: Statuses.Building, 
                updatePhone: ApiPhone
            }, ...(shipping.status || [])]

        shipping.updatePhone = ApiPhone
       
        await repo.save(shipping)
        res.send("id_list_message=t-בוצע.&go_to_folder=/8/1")
    } catch {
        res.send("id_list_message=t-שגיאה.&go_to_folder=/8/1")
    }
})

// 8.2 הגיע לדירה
YemotRouts.get('/Delivered', api.withRemult, async (req, res) => {
    try {
        const [packId, ApiPhone] = [`${req.query['packId']}`, `${req.query['ApiPhone']}`]
        const repo = remult.repo(Deliveries)
        const shipping =  (await repo.find({where: {id: packId}}))[0]

        if(!shipping) {
            res.send("id_list_message=t-מספר משלוח שגוי.&go_to_folder=/8/2"); 
            return;
        } else if (shipping.status.findIndex(s => s.status === Statuses.Delivered) > -1) {
            res.send("id_list_message=t-הסטטוס כבר עודכן.&go_to_folder=/8/2");
            return;
        }

        shipping.status = [
            {
                createdAt:new Date(), 
                status: Statuses.Delivered, 
                updatePhone: ApiPhone
            }, ...(shipping.status || [])]

        shipping.updatePhone = ApiPhone
       
        await repo.save(shipping)
        sendNotification(shipping)
        res.send("id_list_message=t-בוצע.&go_to_folder=/8/2")
    } catch {
        res.send("id_list_message=t-שגיאה.&go_to_folder=/8/2")
    }
})

// ביטול מסירה עם הודעה 8.4
YemotRouts.get('/CancelDelivered', api.withRemult, async (req, res) => {
    try {
        const [packId, ApiPhone] = [`${req.query['packId']}`, `${req.query['ApiPhone']}`]
        const repo = remult.repo(Deliveries)
        const shipping =  (await repo.find({where: {id: packId}}))[0]

        if(!shipping) {
            res.send("id_list_message=t-מספר משלוח שגוי.&go_to_folder=/8/5"); 
            return;
        } else if (shipping.status.findIndex(s => s.status === Statuses.Delivered) === -1) {
            res.send("id_list_message=t-טרם עודכן סטטוס הגיע לדירה.&go_to_folder=/8/5");
            return;
        }

        shipping.status = [
             ...(shipping.status.filter(st => st.status !== Statuses.Delivered) || [])]

        shipping.updatePhone = ApiPhone
       
        await repo.save(shipping)
        sendCancelNotification(shipping)
        res.send("id_list_message=t-בוצע.&go_to_folder=/8/5")
    } catch {
        res.send("id_list_message=t-שגיאה.&go_to_folder=/8/5")
    }
})

// עדכון מרובה הגיע לדירה 8.3
YemotRouts.get('/DeliveredMany', api.withRemult, async (req, res) => {
    try {
        const [packIdStart, packIdEnd,  ApiPhone] = [`${req.query['packIdStart']}`,`${req.query['packIdEnd']}`, `${req.query['ApiPhone']}`]
        const repo = remult.repo(Deliveries)
        for (let index = Number(packIdStart); index < Number(packIdEnd); index++) {
            
            const shipping =  (await repo.find({where: {id: index.toString()}}))[0]
            
            
        
        shipping.status = [
            {
                createdAt:new Date(), 
                status: Statuses.Delivered, 
                updatePhone: ApiPhone
            }, ...(shipping.status || [])]
            
            shipping.updatePhone = ApiPhone
            
            await repo.save(shipping)
            sendNotification(shipping)
        }
            res.send("id_list_message=t-בוצע.&go_to_folder=/8/2")
        } catch {
            res.send("id_list_message=t-שגיאה.&go_to_folder=/8/2")
        }
})


YemotRouts.post('/getYemotToken', async (req, res) => {
    const {guid} = req.body;
    if(guid !== 'd57c96dd-74bc-439c-a954-29a0d0ef691c') {
        res.sendStatus(403)
        return;
    }
    const resFromYemot = await (await fetch('https://www.call2all.co.il/ym/api/Login?username=023137470&password=5386')).json();
    if(!resFromYemot.token) {
        res.sendStatus(500)
        return;
    }

    res.send(resFromYemot.token)
})

let phonesToSendNotification: string[] = [];
let isTimeoutExist = false;

async function sendNotification(shipping: Deliveries) {
    if (!shipping.count) return;

    // שליפת פרטי האדם
    const repo = remult.repo(People);
    const people = (await repo.find({where: { id: shipping.peopleId }}))[0];
    
    if (!people || !people.phones || !people.phones.length) {
        console.log(`No phone numbers found for shipping ID: ${shipping.peopleId}`);
        return;
    }

    // הוספת הטלפון לרשימת הודעות
    phonesToSendNotification.push(people.phones[0]);

    // אם טיימר כבר קיים, צא מהפונקציה
    if (isTimeoutExist) return;

    isTimeoutExist = true;

    // טיימר לשליחת הודעות
    setTimeout(async () => {
        isTimeoutExist = false;
        const phonesToSend = [...phonesToSendNotification]; // שכפול הרשימה
        phonesToSendNotification = []; // איפוס הרשימה

        try {
            const response = await fetch(
                `https://www.call2all.co.il/ym/api/RunCampaign?token=023137470:5386&templateId=37162&phones=${phonesToSend.join(':')}`
            );
            const resJson = await response.json();

            if (!resJson.campaignId) {
                console.error('Error: Missing campaign ID', resJson);
                phonesToSendNotification.push(...phonesToSend); // החזרת הטלפונים לרשימה
                return;
            }

            console.log('Campaign sent successfully:', resJson);

            // כתיבת לוג
            const logMessage = `Sent notification to phones: ${phonesToSend.map(phone => `"${phone}"`).join(',')} at ${new Date()} campaignId: ${resJson?.campaignId}\n`;
            await fs.appendFile('shippings.log', logMessage);
        } catch (error) {
            console.error('Error calling Yemot API:', error);
            phonesToSendNotification.push(...phonesToSend); // החזרת הטלפונים לרשימה
        }
    }, 1000 * 60 * 5); // המתנה של 5 דקות
}

// הודעת ביטול
async function sendCancelNotification(shipping:Deliveries){
    const repo = remult.repo(People)
    const people = (await repo.find({where: {id: shipping.peopleId}}))[0]
    try {
        await fetch(`https://www.call2all.co.il/ym/api/RunCampaign?token=023137470:5386&templateId=38889&phones={"${people.phones[0]}":""}`)
    } catch (error) {
        console.log("error call to yemot!");
    }
}


export default YemotRouts