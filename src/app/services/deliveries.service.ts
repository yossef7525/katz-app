import { Injectable, OnInit, signal } from '@angular/core';
import { Deliveries, People } from '../../shared/types';
import {  remult } from 'remult';
import { PoepleService } from './poeple.service';

@Injectable({
  providedIn: 'root'
})
export class DeliveriesService {


  public deliveries: Deliveries[] = []
  public total = 0
  public repo = remult.repo(Deliveries)
  
  constructor(private readonly poepleService:PoepleService){}
  async init(pageSize:number, pageIndex:number, ids?:string[], q?:string): Promise<boolean> {
     this.repo.liveQuery({limit: pageSize, page: pageIndex,
      include: {people: true},
      where: { ...(ids?.length ? { peopleId: { $in: ids } } : {}), ...(q ? { id: q } : {}) },
      orderBy: {updatedAt: 'desc'}}).subscribe(async (info)=> {
      // const peopleIds = info.items.map(row => row.peopleId);
      // await this.poepleService.getPeoplesByIds(peopleIds)
      this.deliveries = info.items
    })
      this.total = await this.repo.count()
      return false
  }
  async insert(deliverie:Partial<Deliveries>):Promise<Deliveries>{
   const res = await this.repo.insert(deliverie)
  //  this.deliveries.update((deliveries:Deliveries[]) => [...deliveries, res])
   return res;
  }
  async update(id:string, deliverie:Partial<Deliveries>){
    
    await this.repo.update(id, deliverie);
  }
}
