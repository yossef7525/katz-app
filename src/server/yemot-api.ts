import { Router } from "express";
import {api} from './api';
import { remult } from "remult";
import { Deliveries, People, Statuses } from "../shared/types";

const YemotRouts = Router();

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


async function sendNotification(shipping:Deliveries){
    const repo = remult.repo(People)
    const people = (await repo.find({where: {id: shipping.peopleId}}))[0]
    fetch(`https://www.call2all.co.il/ym/api/RunCampaign?token=023137470:5386&templateId=37162&phones={"${people.phones[0]}":""}`)
}


export default YemotRouts