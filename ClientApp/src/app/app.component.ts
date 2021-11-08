import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerResponse } from 'src/interfaces/response.interface';
import { database } from 'src/environments/database';
import { UserService } from 'src/services/user.service';
import { Account } from 'src/interfaces/account.interface';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private _user: UserService,
    private router: Router,
    private http: HttpClient
    ) { }

  ngOnInit() {
    this.http.post<ServerResponse>(`${database.BASE_URL}/authorize`, {
      REFRESH_TOKEN: document.cookie.split("REFRESH_TOKEN=")[1]
    }).subscribe((response: ServerResponse) => {
      if (response.success) {

        const { user, TOKENS } = response.data;
  
          this._user.currentUser = <Account>user;
          localStorage.clear();
          localStorage.setItem('ACCESS_TOKEN', TOKENS.ACCESS_TOKEN);
          document.cookie = `REFRESH_TOKEN=${TOKENS.REFRESH_TOKEN}`;
  
          this.router.navigate(['mainpage']);
      } else {
        this.router.navigate(['login']);
        localStorage.clear();
      }
    });
  }
}
