import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { UserService } from 'src/services/user.service';
import { openLeftNoDestroy } from 'src/app/lib/rep-animations';
import { UtilsService } from 'src/services/utils.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { Unsubscriber } from 'src/app/lib/rep-decorators';

@Component({
  templateUrl: './p-main.component.html',
  styleUrls: ['./p-main.component.scss'],
  animations: [
    openLeftNoDestroy("250px", "100ms")
  ]
})
@Unsubscriber
export class PSettingsComponent implements OnInit {

  constructor(
    private _user: UserService,
    private _utils: UtilsService,
    private router: Router,
    public breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit(): void {
    if (this._utils.isMobile) {
      this.navOpen = false;
    }
  }

  protected mobileListener: Subscription = this.breakpointObserver
    .observe(['(max-width: 450px)'])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.navOpen = false;
      }
    });

  public navOpen: boolean = true;

  public menus: Array<REPButton> = [
    {
      name: "Profile",
      icon: "person",
      route: '/settings/profile',
    },
    {
      name: "Privacy",
      icon: "security",
      route: '/settings/privacy',
    },
    {
      name: "New channel",
      icon: "add",
      route: '/settings/newchannel',
    },
    {
      name: "Channel settings",
      icon: "admin_panel_settings",
      route: '/settings/channelsettings/',
    },
    {
      name: "Appearance",
      color: "hotpink",
      icon: "tune",
      route: '/settings/appearance',
    },
    // {
    //   name: "Hot Keys",
    //   icon: "keyboard",
    //   route: '/settings/newchannel',
    // },
    {
      name: "Log out",
      color: "#ff0000",
      icon: "logout",
      onClick: () => {
        this._user.logOut();
      }
    },
  ];

  public currentRoute: string = (() => {
    const actualRoute = this.router.url.replace(/[0-9]/g, "");

    return this.menus.find(menu => menu.route == actualRoute)?.name;
  })();

  async changeRoute(index: number) {
    if (this.menus[index].route)
      await this.router.navigateByUrl(this.menus[index].route)
    else
      this.menus[index].onClick();

    this.currentRoute = this.menus[index].name;

    if (this._utils.isMobile)
      this.navOpen = false;
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent) {
    const key = event.key;
    if (key == "Escape")
      this.router.navigate(['mainpage']);
  }

}
