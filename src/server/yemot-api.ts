import { Router } from "express";
import {api} from './api';
import { remult } from "remult";
import { Deliveries, People, Statuses } from "../shared/types";

const YemotRouts = Router();

YemotRouts.get('/details', api.withRemult, async (req, res)=> {
    const ApiPhone= `${req.query['ApiPhone']}`
    const repo = remult.repo(People)
    const people = (await repo.find({where:{phones: {$contains: ApiPhone}}})).at(0)
    if(!people) {
        res.send("id_list_message=t-מספר טלפון לא קיים במערכת.&go_to_folder=/")
    } else {
        const message = `id_list_message=t-להלן הפרטים כפי שמעודכנים במערכת: שם: ${people.firstName} ${people.lastName}: כתובת: ${people.address}: בנין: ${people.building} קומה: ${people.floor.replaceAll('-', ' מינוס ')}: דירה: ${people.apartment}: מספר ילדים: ${people.children}: מספר עופות: ${people.poultry}: כשרות: ${people.cosher}: אלו הפרטים שמעודכנים אצלינו במידה וחלק מהפרטים לא נכונים אנא עדכן אותנו בהקדם.&go_to_folder=/`
        res.send(message)
    }

})


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


async function sendNotification(shipping:Deliveries){
    const repo = remult.repo(People)
    const people = (await repo.find({where: {id: shipping.peopleId}}))[0]
    if(!shipping.count) return;
    try {
        await fetch(`https://www.call2all.co.il/ym/api/RunCampaign?token=023137470:5386&templateId=37162&phones={"${people.phones[0]}":""}`)
    } catch (error) {
        console.log("error call to yemot!");
        
    }
    }


export default YemotRouts