import { BackendMethod, remult } from 'remult';
import { People } from '../types';
import { SheetFields } from '../types/sheet-fields';
import * as _ from 'lodash';
import { active } from 'sortablejs';

const sheetEndpoint =
  'https://opensheet.elk.sh/1ech-KXV6ucEqGhFhFTG9Tz-Ud4XQlR_a0_TQAaVN2G8/%D7%92%D7%99%D7%9C%D7%99%D7%95%D7%9F1!d2:AJ14989';
const repo = remult.repo(People);

export class SheetSyncController {
  @BackendMethod({ allowed: true })
  public static async syncSheet(): Promise<{updatedCount:number, newCount:number}> {
    const peoplesFromServer = await repo.find();

    const res = await fetch(sheetEndpoint);
    const peoplesFromSheet = (await res.json()).filter(
      (p: any) => p[SheetFields.Id]
    );

    const idsExist = peoplesFromServer.map((p) => p.id);

    const updatedPeoples = peoplesFromSheet.filter((p: any) =>
      idsExist.includes(p[SheetFields.Id])
    );
    
    const newPeoples = peoplesFromSheet.filter(
        (p: any) => p[SheetFields.Id] && !idsExist.includes(p[SheetFields.Id])
    );

    let newCount = 0;

    for (let people of newPeoples) {
      try {
        const peopleNew = {
          id: people[SheetFields.Id],
          active: true,
          firstName: people[SheetFields.FirstName],
          lastName: people[SheetFields.LastName],
          address: people[SheetFields.Street],
          building: people[SheetFields.Building],
          floor: people[SheetFields.Floor],
          apartment: people[SheetFields.House],
          poultry:
            people[SheetFields.Poultry] - (people[SheetFields.PoultrySub] || 0),
          phones: [
            addLeadingZero(people[SheetFields.PhoneMain]),
            addLeadingZero(people[SheetFields.Phone]),
            addLeadingZero(people[SheetFields.Phone2]),
          ],
          children: Number(people[SheetFields.Children]),
          gabaiCode: people[SheetFields.CodeGabay],
          poultryNextMonth:  Number(people[SheetFields.poultryNextMonth]) || 0
        };
        await repo.insert(peopleNew);
        newCount++;
      } catch (error) {
        console.log(people.id, ': not inserted');
      }
    }

    let updatedCount = 0;
    for (let people of updatedPeoples) {
      try {
        const orgPeople = peoplesFromServer.find(
          (p) => p.id == people[SheetFields.Id]
        );
        const peopleUpdate = {
          id: people[SheetFields.Id],
          firstName: people[SheetFields.FirstName],
          lastName: people[SheetFields.LastName],
          address: people[SheetFields.Street],
          building: people[SheetFields.Building],
          floor: people[SheetFields.Floor],
          apartment: people[SheetFields.House],
          poultry:
            people[SheetFields.Poultry] - (people[SheetFields.PoultrySub] || 0),
          phones: [
            addLeadingZero(people[SheetFields.PhoneMain]),
            addLeadingZero(people[SheetFields.Phone]),
            addLeadingZero(people[SheetFields.Phone2]),
          ],
          children: Number(people[SheetFields.Children]),
          gabaiCode: people[SheetFields.CodeGabay],
          poultryNextMonth:  Number(people[SheetFields.poultryNextMonth]) || 0,
        };

        if (!_.isMatch(orgPeople!, peopleUpdate)){
            console.log('update', peopleUpdate.id);
            await repo.update(peopleUpdate.id, peopleUpdate);
            updatedCount++;
        };
      } catch (error) {
        console.log(people.id, ': not updated');
      }
    }
    return {updatedCount, newCount};
  }
}

function addLeadingZero(str: string): string {
  return str.startsWith('0') ? str : '0' + str;
}
