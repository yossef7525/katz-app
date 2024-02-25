import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserInfo, remult } from "remult";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public remult = remult
  constructor(private http: HttpClient) { }

  async getUser(): Promise<UserInfo | undefined> {
    if (remult.user) return remult.user
    const res = await this.http.get<UserInfo>("/api/currentUser").toPromise()
    return res;
  }
  signOut() {
    this.http
      .post("/api/signOut", {})
      .subscribe(() => (this.remult.user = undefined))
  }

}