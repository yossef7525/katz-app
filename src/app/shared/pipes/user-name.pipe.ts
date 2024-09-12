import { Pipe, PipeTransform } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { PoepleService } from '../../services/poeple.service';

@Pipe({
  name: 'UserName',
})
export class UserNamePipe implements PipeTransform {
  constructor(private peopleService: PoepleService) {}

  transform(userId: string, args?: any): Observable<string | undefined> {
    if (!userId) return of(undefined);

    return this.peopleService.getPeopleByIdAsync(userId).pipe(map(user => user ? `${user?.lastName} ${user?.firstName}` : 'לא נמצא'));
  }
}