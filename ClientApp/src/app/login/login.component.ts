import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ServerResponse } from 'src/interfaces/response.interface';
import { database } from 'src/environments/database';
import { UserService } from 'src/services/user.service';
import { Router } from '@angular/router';
import { Account } from 'src/interfaces/account.interface';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private user: UserService,
    private router: Router
    ) { }

  ngOnInit(): void {
  }

  public userName: string = "";
  public password: string = "";

  public alert: string = "";

  logIn() {
    this.http.post<ServerResponse>(`${database.BASE_URL}/logIn`, {
      userName: this.userName,
      password: this.password
    }).subscribe((response: any) => {
      if (!response.success) {
        this.alert = <string>response.message;
      } else {

        const { user, TOKENS } = response.data;

        this.user.currentUser = <Account>user;

        localStorage.clear();
        localStorage.setItem('ACCESS_TOKEN', TOKENS.access_token);
        document.cookie = `REFRESH_TOKEN=${TOKENS.refresh_token}`;

        this.router.navigate(['mainpage']);
      }
    });
  }



}
