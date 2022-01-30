import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { MessagesService } from 'src/services/messages.service';
import { UserService } from 'src/services/user.service';
import { UtilsService } from 'src/services/utils.service';
import { WebSocket } from 'src/app/lib/websocket';
import { server } from 'src/environments/server';
import { REPChatComponent } from 'src/app/lib/rep-chat/rep-chat.component';

@Component({
  templateUrl: './p-mainpage.component.html',
  styleUrls: ['./p-mainpage.component.scss']
})
export class PMainpageComponent extends WebSocket implements OnInit {

  constructor(
    public _user: UserService,
    public _msService: MessagesService,
    public _utils: UtilsService,
    private cookieService: CookieService,
    private router: Router
  ) {
    super(server.WEB_SOCKET);
  }

  private sessionSubscription: Subscription;

  ngOnInit(): void {
    this._msService.getChannels();

    this._msService.channels$
      .pipe(first())
      .subscribe(() => {

        const channelsRef = this.channels.find(tab => tab.tabname == "Channels");

        channelsRef.sections = this._msService.channels;

        const room = channelsRef.sections[0]?._id;

        if (room) {
          this._msService.joinChannel(room);
        }
    });

    this.sessionSubscription?.unsubscribe();
    this.sessionSubscription = this.listen(this.cookieService.get("sid"))
      .subscribe((status) => {
        if (status == "forceKick")
          this._user.logOut(true);
      });
  }

  public readonly msgOptions: Array<REPButton> = [
    {
      name: "Edit",
      icon: "edit",
      visible: (msgIndex: number) => this._msService.messages[msgIndex].auth,
      enabled: () => true,
      onClick: (msgIndex: number) => {
        console.log("EDIT");
      }
    },
    {
      name: "Report",
      icon: "flag",
      enabled: () => true,
      visible: (msgIndex: number) => !this._msService.messages[msgIndex].auth,
      onClick: (msgIndex: number) => {
        console.log("REPORT");
      }
    },
    {
      name: "Delete",
      icon: "delete",
      color: "danger",
      enabled: () => true,
      visible: (msgIndex: number) => {
        if (this._msService.messages[msgIndex].auth) {
          return true;
        }

        return this._msService.chPermissions.deleteMessage;
      },
      onClick: (msgIndex: number) => {
        this._utils.showRequest("Delete message", "Are you sure you want to delete this message?", () => {
          this._msService.deleteMessage(this._msService.messages[msgIndex].id);
        });
      }
    },
    {
      name: "Kick",
      icon: "remove_circle_outline",
      color: "warning",
      enabled: () => true,
      visible: (msgIndex: number) => {
        if (this._msService.messages[msgIndex].auth) {
          return false;
        }

        return this._msService.chPermissions.kickMembers;
      },
      onClick: (msgIndex: number) => {
        const msg = this._msService.messages[msgIndex];

        this._utils.showRequest(`Kick ${msg.name}`, `Are you sure you want to kick out ${msg.name}? He will be able to rejoin later...`, () => {

        });
      }
    },
    {
      name: "Ban",
      icon: "delete_forever",
      color: "danger",
      enabled: () => true,
      visible: (msgIndex: number) => {
        if (this._msService.messages[msgIndex].auth) {
          return false;
        }

        return this._msService.chPermissions.banMembers;
      },
      onClick: (msgIndex: number) => {
        const msg = this._msService.messages[msgIndex];

        this._utils.showRequest(
          `Ban ${msg.name}`, 
          `Are you sure you want to ban ${msg.name}? He will NOT be able to rejoin later till his ban is revoked!`, 
          () => {
            this._msService.banUser(this._msService.currentRoom, msg.author);
          }
        );
      }
    }
  ];

  public readonly options: Array<REPButton> = [
    {
      name: "Leave",
      icon: "delete",
      color: "danger",
      enabled: () => true,
      visible: () => true,
      onClick: () => {

      }
    }
  ];

  @ViewChild(REPChatComponent) private chat;

  public readonly chatOptions: Array<REPButton> = [
    {
      name: "Delete messages",
      icon: "delete_sweep",
      tooltip: "Deletes selected messages",
      visible: () => true,
      enabled: () => {
        if (this.chat?.selections.length > 0) {
          if (this._msService.chPermissions?.deleteMessage) return true;
          return this.chat?.selections.some(msg => msg.auth == false);
        } else return false;
      },
      onClick: () => { }
    }
  ];

  public channelsTab: number = 0;

  public channels: Array<{ 
    tabname: string,
    icon?: string,
    sections: Array<any> 
  }> = [
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

  public serverInfoTab: number = 0;

  public serverInfo: Array<{ 
    tabname: string,
    icon?: string,
    sections: Array<any> 
  }> = [
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
