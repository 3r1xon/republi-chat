import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { UserService } from 'src/services/user.service';

@Component({
  templateUrl: './p-main.component.html',
  styleUrls: ['./p-main.component.scss']
})
export class PSettingsComponent {

  constructor(
    private _user: UserService,
    private router: Router
    ) { }

  public menus: Array<REPButton> = [
    {
      name: "Profile",
      icon: "person",
      route: '/settings/profile',
      enabled: () => true,
      visible: () => true,
    },
    {
      name: "Privacy",
      icon: "security",
      route: '/settings/privacy',
      enabled: () => true,
      visible: () => true,
    },
    {
      name: "New channel",
      icon: "add",
      route: '/settings/newchannel',
      enabled: () => true,
      visible: () => true,
    },
    {
      name: "Channel settings",
      icon: "admin_panel_settings",
      route: '/settings/channelsettings',
      enabled: () => true,
      visible: () => true,
    },
    {
      name: "Appearance",
      color: "hotpink",
      icon: "tune",
      route: '/settings/newchannel',
      enabled: () => true,
      visible: () => true,
    },
    {
      name: "Hot Keys",
      icon: "keyboard",
      route: '/settings/newchannel',
      enabled: () => true,
      visible: () => true,
    },
    {
      name: "Log out",
      color: "#ff0000",
      icon: "logout",
      enabled: () => true,
      visible: () => true,
      onClick: async () => { 
        await this._user.logOut();
      }
    },
  ];

  public currentRoute: string = this.menus.find(menu => menu.route == this.router.url).name;

  async changeRoute(index: number) {
    if (this.menus[index].route)
      await this.router.navigateByUrl(this.menus[index].route)
    else
      this.menus[index].onClick();

    this.currentRoute = this.menus[index].name;
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent) {
    const key = event.key;
    if (key == "Escape")
      this.router.navigate(['mainpage']);
  }

}
