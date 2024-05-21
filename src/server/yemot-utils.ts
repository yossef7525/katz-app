import { remult } from "remult";
import { Deliveries, People } from "../shared/types";


  const sendCancelNotification = async (shipping:Deliveries)=>{
        const repo = remult.repo(People)
        const people = (await repo.find({where: {id: shipping.peopleId}}))[0]
        try {
            await fetch(`https://www.call2all.co.il/ym/api/RunCampaign?token=023137470:5386&templateId=38889&phones={"${people.phones[0]}":""}`)
        } catch (error) {
            console.log("error call to yemot!");
        }
 }

 const sendNotification = async (shipping:Deliveries) => {
    const repo = remult.repo(People)
    const people = (await repo.find({where: {id: shipping.peopleId}}))[0]
    if(!shipping.count) return;
    try {
        await fetch(`https://www.call2all.co.il/ym/api/RunCampaign?token=023137470:5386&templateId=37162&phones={"${people.phones[0]}":""}`)
    } catch (error) {
        console.log("error call to yemot!");
    }
}

 const YemotUtils = {sendNotification, sendCancelNotification}
 export default YemotUtils

