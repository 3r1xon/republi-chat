import {
  Component,
  HostListener,
  Input,
} from '@angular/core';
import { Router } from '@angular/router';
import { Account } from 'src/interfaces/account.interface';
import { UtilsService } from 'src/services/utils.service';
import { WebSocket } from 'src/app/lib/websocket';
import { server } from 'src/environments/server';
import { REPButton } from 'src/interfaces/repbutton.interface';

@Component({
  selector: 'rep-status-bar',
  templateUrl: './rep-status-bar.component.html',
  styleUrls: ['./rep-status-bar.component.scss']
})
export class REPStatusBarComponent extends WebSocket {

  constructor(
    private _utils: UtilsService,
    private router: Router,
  ) {
    super(server.WEB_SOCKET);
  }

  @Input()
  public user: Account;

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent) {
    const key = event.key;
    if (key == "Escape")
      this.router.navigate(['settings']);
  }

  public readonly navigations: Array<REPButton> = [
    {
      name: "Close Group",
      icon: "group",
      tooltip: "Close right side-bar",
      visible: () => true,
      enabled: () => true,
      onClick: () => { 
        this._utils.showServerGroup = !this._utils.showServerGroup;
      }
    },
    {
      name: "Settings",
      icon: "settings",
      tooltip: "Navige to settings",
      visible: () => true,
      enabled: () => true,
      onClick: () => {
        this.router.navigate(['settings']);
      }
    },
  ];
}
