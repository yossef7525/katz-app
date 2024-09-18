import { Component, NgZone, OnInit } from '@angular/core';
import { UserRoles } from '../shared/types/user-roles';
import { HttpClient } from '@angular/common/http';
import { UserInfo, remult } from 'remult';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(zone: NgZone, private http: HttpClient) {
    remult.apiClient.wrapMessageHandling = handler => zone.run(() => handler())
  }
  remult = remult
  title = 'katz-app';

  ngOnInit(): void {
      this.http
        .get<UserRoles>("/api/currentUser")
        .subscribe(user => (this.remult.user = user as UserInfo))
  }
}
