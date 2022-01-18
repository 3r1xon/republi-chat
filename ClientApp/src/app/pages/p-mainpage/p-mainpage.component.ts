import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { MessagesService } from 'src/services/messages.service';
import { UserService } from 'src/services/user.service';
import { UtilsService } from 'src/services/utils.service';
import { WebSocketService } from 'src/services/websocket.service';

@Component({
  templateUrl: './p-mainpage.component.html',
  styleUrls: ['./p-mainpage.component.scss']
})
export class PMainpageComponent implements OnInit, OnDestroy {

  constructor(
    public _user: UserService,
    public _msService: MessagesService,
    public _utils: UtilsService,
    private _webSocket: WebSocketService,
    private cookieService: CookieService,
    private router: Router
  ) { }

  private sessionSubscription: Subscription;

  ngOnInit(): void {
    this._msService.getChannels();

    this._msService.channels$
      .pipe(first())
      .subscribe(() => {

        this.channels = [
          {
            tabname: "Channels",
            icon: "list",
            sections: this._msService.channels
          },
          {
            tabname: "Friends",
            icon: "people",
            sections: []
          }
        ];
    
        this.serverInfo = [
          {
            tabname: "Online",
            icon: "public",
            sections: []
          },
          {
            tabname: "Offline",
            icon: "no_accounts",
            sections: []
          },
          {
            tabname: "Pending",
            icon: "pending",
            sections: []
          },
        ];

        this.channels[0].sections = this._msService.channels;
    
        const room = this.channels[0]?.sections[0]?._id;
    
        if (room) {
          this._msService.joinChannel(room);
        }
    });

    this.sessionSubscription?.unsubscribe();
    this.sessionSubscription = this._webSocket.listen(this.cookieService.get("SESSION_ID"))
      .subscribe((status) => {
        if (status == "forceKick")
          this._user.logOut(true);
      });
  }

  ngOnDestroy(): void {
    this._msService.destroyMsSubscriptions();
  }

  public options: Array<REPButton> = [
    {
      name: "Leave",
      icon: "delete",
      color: "danger",
      onClick: () => {}
    }
  ];

  public channelsTab: number = 0;

  public channels: Array<{ 
    tabname: string,
    icon?: string,
    sections: Array<any> 
  }> = [];

  public serverInfoTab: number = 0;

  public serverInfo: Array<{ 
    tabname: string,
    icon?: string,
    sections: Array<any> 
  }> = [];


  selectChannel(room: number) {
    this._msService.joinChannel(room);
  }

  sendChannelMessage(message: string) {
    this._msService.sendMessage(message);
  }

  async addNew() {
    await this.router.navigateByUrl('/settings/newchannel');
  }

}
