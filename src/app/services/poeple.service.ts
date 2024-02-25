import { Injectable, OnInit, signal } from '@angular/core';
import { People } from '../../shared/types';
import {  remult } from 'remult';
import { Observable, from } from 'rxjs';
import { BaseStateService } from './base-state.service';

@Injectable({
  providedIn: 'root'
})
export class PoepleService extends BaseStateService<{
  peoples: Record<string, People>
}>{

  constructor() {
    super({logStateChanges: true})
   }

  public poeples = signal<People[]>([])
  public total = 0
  public repo = remult.repo(People)
  
  async init(pageSize:number, pageIndex:number, ids?:string[]): Promise<void> {
      this.poeples.set(await this.repo.find({limit: pageSize, page: pageIndex, include: {deliveries: true}, where: { ...(ids?.length ? { id: { $in: ids } } : {}) }}))
      this.total = await this.repo.count()
  }
  async insert(people:Partial<People>):Promise<People>{
   const res = await this.repo.insert(people)
   this.poeples.update((poeples:People[]) => [...poeples, res])
   return res;
  }

  async getPeopleById(peopleId: string): Promise<People | undefined> {
    const peopleState = this.state?.peoples || {};

    if (peopleState[peopleId]) return peopleState[peopleId];

    const people = (await this.getPeoplesByIds([peopleId]))[0];

    return people;
  }

  async getPeoplesByIds(ids: string[]): Promise<People[]> {
    const peopleState = this.state?.peoples || {};

    const peopleIds = [...new Set(ids)];

    const isPeoplesExists = peopleIds.every(userId => peopleState[userId]);
    if (isPeoplesExists) return peopleIds.map(userId => peopleState[userId]);

    const peoples = await this.repo.find({where: {id: {$in: peopleIds}}})

    peoples.forEach(user => {
      peopleState[user.id] = user;
    });

    this.setState({ peoples: peopleState });

    return peoples;
  } 
  getPeopleByIdAsync(peopleId: string): Observable<People | undefined> {
    return from(this.getPeopleById(peopleId));
  }
}
