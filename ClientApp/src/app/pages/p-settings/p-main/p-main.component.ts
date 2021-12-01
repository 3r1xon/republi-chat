import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/services/user.service';

@Component({
  templateUrl: './p-main.component.html',
  styleUrls: ['./p-main.component.scss']
})
export class PSettingsComponent implements OnInit {

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
      icon: "person",
      onClick: async () => {
        await this.router.navigateByUrl('/settings/profile');
      }
    },
    {
      name: "Privacy",
      color: "#FFFFFF",
      icon: "security",
      onClick: async () => {
        await this.router.navigateByUrl('/settings/privacy');
      }
    },
    {
      name: "Log out",
      color: "#ff0000",
      icon: "logout",
      onClick: async () => { 
        await this._user.logOut();
      }
    },
  ];

  public currentRoute: string = this.menus[0].name;

  async changeRoute(index: number) {
    await this.menus[index].onClick();
    this.currentRoute = this.menus[index].name;
  }

}
