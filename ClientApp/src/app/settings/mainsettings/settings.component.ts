import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(
    private _user: UserService,
    private router: Router
    ) { }

  ngOnInit(): void {
  }

  public menus = [
    {
      name: "Profile",
      color: "#FFFFFF",
      icon: "user",
      onClick: () => {
        this.router.navigate([
          { 
            outlets: { 
              primary: ['settings'],
              settings: ['profile']
            }
          }
        ]);
      }
    },
    {
      name: "Log out",
      color: "#ff0000",
      icon: "logout",
      onClick: () => { 
        this._user.logOut();
      }
    },
  ];

  public currentRoute: string = this.menus[0].name;

  changeRoute(index: number) {
    this.menus[index].onClick();
    this.currentRoute = this.menus[index].name;
  }

}
