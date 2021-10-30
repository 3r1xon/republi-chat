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
    }).subscribe((response) => {
      if (!response.success) {
        this.alert = <string>response.message;
      } else {
        this.user.currentUser = <Account>response.data;
        this.router.navigate(['mainpage']);
      }
    });
  }



}
