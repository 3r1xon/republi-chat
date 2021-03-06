import {
  Component,
  HostListener,
} from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from 'src/services/utils.service';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { MessagesService } from 'src/services/messages.service';
import { UserService } from 'src/services/user.service';
import { UserStatus } from 'src/interfaces/account.interface';

@Component({
  selector: 'mtd-status-bar',
  templateUrl: './mtd-status-bar.component.html',
  styleUrls: ['./mtd-status-bar.component.scss']
})
export class MTDStatusBarComponent {

  constructor(
    public _utils: UtilsService,
    public _user: UserService,
    private _ms: MessagesService,
    private router: Router
  ) { }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent) {
    const key = event.key;
    if (key == "Escape")
      this.router.navigate(['settings']);
  }

  public readonly navigations: Array<REPButton> = [
    {
      name: "Close Channels",
      icon: "list",
      tooltip: "Close/open left side-bar",
      onClick: () => {

        if (this._utils.isMobile) {
          this._utils.settings.showServerGroup = false;
        }

        this._utils.settings.showChannels = !this._utils.settings.showChannels;
      }
    },
    {
      name: "Close Group",
      icon: "group",
      tooltip: "Close/open right side-bar",
      visible: () => this._ms.currentChannel,
      onClick: () => {

        if (this._utils.isMobile) {
          this._utils.settings.showChannels = false;
        }

        this._utils.settings.showServerGroup = !this._utils.settings.showServerGroup;
      }
    },
    {
      name: "Settings",
      icon: "settings",
      tooltip: "Navigate to settings",
      onClick: () => {
        this.router.navigate(['settings']);
      }
    },
  ];

  public readonly changeStatus: Array<REPButton> = [
    {
      name: "Online",
      color: "success",
      onClick: () => {
        this._user.changeUserStatus(UserStatus.Online);
      }
    },
    {
      name: "Inactive",
      color: "warning",
      onClick: () => {
        this._user.changeUserStatus(UserStatus.Inactive);
      }
    },
    {
      name: "Offline",
      color: "danger",
      onClick: () => {
        this._user.changeUserStatus(UserStatus.Offline);
      }
    },
    {
      name: "Do not disturb",
      color: "danger",
      onClick: () => {
        this._user.changeUserStatus(UserStatus['Do not disturb']);
      }
    }
  ];
}
