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
    this.particleNumber = Array(30).fill(0);
  }

  public particleNumber: Array<any> = []; 

  public userName: string = "";
  public password: string = "";

  public alert: string = "";

  async logIn() {
    this.alert = await this._user.logIn(this.userName, this.password) ?? "";
  }
}