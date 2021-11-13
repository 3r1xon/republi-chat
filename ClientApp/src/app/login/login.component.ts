import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private _user: UserService
    ) { }

  ngOnInit(): void {
  }

  public userName: string = "";
  public password: string = "";

  public alert: string = "";

  async logIn() {
    this.alert = await this._user.logIn(this.userName, this.password) ?? "";
  }
}