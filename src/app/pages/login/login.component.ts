// src/app/auth/auth.component.ts

import { Component, OnInit } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { UserRoles } from "../../../shared/types/user-roles"
import { UserInfo, remult } from "remult"

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent  {
  constructor(private http: HttpClient) {}

  signInUsername = ""
  signInPassword = ""
  remult = remult

  signIn() {
    this.http
      .post<UserRoles>("/api/signIn", {
        username: this.signInUsername,
        password: this.signInPassword
      })
      .subscribe({
        next: user => {
          this.remult.user = user as UserInfo
          this.signInUsername = ""
        },
        error: error => alert(error.error)
      })
  }

  signOut() {
    this.http
      .post("/api/signOut", {})
      .subscribe(() => (this.remult.user = undefined))
  }

  // ngOnInit() {
  //   this.http
  //     .get<UserRoles>("/api/currentUser")
  //     .subscribe(user => (this.remult.user = user as UserInfo))
  // }
}