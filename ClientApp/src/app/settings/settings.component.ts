import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private _user: UserService) { }

  ngOnInit(): void {
  }

  public menus = [
    {
      name: "Log out",
      color: "#ff0000",
      icon: "logout",
      onClick: () => { 
        this._user.logOut();
      }
    }
  ];

}
