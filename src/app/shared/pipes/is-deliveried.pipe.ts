import { Pipe, PipeTransform } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { PoepleService } from '../../services/poeple.service';
import { Statuses, statusList } from '../../../shared/types';

@Pipe({
  name: 'IsDelivered',
})
export class IsDeliveredPipe implements PipeTransform {

  transform(statusList: statusList[], args?: any): boolean{
    if (!statusList) return false;

    return statusList.findIndex(s => s.status === Statuses.Delivered) > -1
  }
}