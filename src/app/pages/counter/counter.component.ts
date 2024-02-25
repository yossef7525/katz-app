import { Component, OnInit } from '@angular/core';
import { LiveQueryChangeInfo, remult } from 'remult';
import { Deliveries, People, Statuses } from '../../../shared/types';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
})
export class CounterComponent implements OnInit {
  poultryCounter = 0;
  familyCounter = 0;
  childrenCounter = 0;
  deliveriesCounter = 0;
  lastDeliveries?: Deliveries;

  peopleRepo = remult.repo(People);
  deliveriesRepo = remult.repo(Deliveries);
  firstLoaded:boolean = false
  async ngOnInit(): Promise<void> {
    this.deliveriesRepo
      .liveQuery({ orderBy: { updatedAt: 'desc' } })
      .subscribe((info: LiveQueryChangeInfo<Deliveries>) => {
        const deliveries = info.items.filter(
          (item) =>
            item.status.findIndex((st) => st.status === Statuses.Delivered) > -1
        );
        this.familyCounter = deliveries.length;
        this.poultryCounter = deliveries.reduce(
          (a, b) => a + (b.count || 0),
          0
        );
        this.deliveriesCounter = info.items.length - deliveries.length;
        this.peopleRepo
          .find({
            where: { id: { $in: deliveries.map((del) => del.peopleId) } },
          })
          .then((peoples) => {
            this.childrenCounter = peoples.reduce(
              (a, b) => a + (b.children || 0),
              0
            );
          });
        // this.lastDeliveries =  info.items[0] ;
        this.lastDeliveries = this.firstLoaded ? info.items[0] : undefined;
        this.firstLoaded = true
        setTimeout(() => {
          this.lastDeliveries = undefined;
        }, 5 * 1000);
      });
  }
}
