import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { REPButton } from 'src/interfaces/repbutton.interface';
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

  public menus: Array<REPButton> = [
    {
      name: "Profile",
      icon: "person",
      route: '/settings/profile'
    },
    {
      name: "Privacy",
      icon: "security",
      route: '/settings/privacy'
    },
    {
      name: "New channel",
      icon: "add",
      route: '/settings/newchannel'
    },
    {
      name: "Channel settings",
      icon: "admin_panel_settings",
      route: '/settings/channelsettings'
    },
    {
      name: "Appearance",
      color: "hotpink",
      icon: "tune",
      route: '/settings/newchannel'
    },
    {
      name: "Hot Keys",
      icon: "keyboard",
      route: '/settings/newchannel'
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
