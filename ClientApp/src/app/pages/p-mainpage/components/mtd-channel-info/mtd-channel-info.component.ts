import { Component } from '@angular/core';
import { Account } from 'src/interfaces/account.interface';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { MessagesService } from 'src/services/messages.service';

@Component({
  selector: 'mtd-channel-info',
  templateUrl: './mtd-channel-info.component.html',
  styleUrls: ['./mtd-channel-info.component.scss'],
})
export class MTDChannelInfoComponent {

  constructor(
    public _ms: MessagesService
  ) { }

  public serverInfoTab: number = 0;

  public serverInfo: Array<{
    tabname: string,
    icon?: string,
  }> = [
    {
      tabname: "Members",
      icon: "groups",
    },
    {
      tabname: "Pending",
      icon: "pending",
    },
  ];

  public pendingOptions: Array<REPButton> = [
    {
      name: "Accept",
      icon: "thumb_up",
      color: "success",
      visible: () => this._ms.chPermissions.acceptMembers,
      onClick: (pendingID: number) => {
        this._ms.API_changePendingStatus(this._ms.currentChannel, pendingID, true)
          .toPromise()
          .then(() => {
            const i = this._ms.currentChannel.pendings
              .findIndex(user => user.id == pendingID);

            this._ms.currentChannel.pendings.splice(i, 1);
          });
      }
    },
    {
      name: "Reject",
      icon: "thumb_down",
      color: "danger",
      visible: () => this._ms.chPermissions.acceptMembers,
      onClick: (pendingID: number) => {
        this._ms.API_changePendingStatus(this._ms.currentChannel, pendingID, false)
          .toPromise()
          .then(() => {
            const i = this._ms.currentChannel.pendings
              .findIndex(user => user.id == pendingID);

            this._ms.currentChannel.pendings.splice(i, 1);
          });
      }
    }
  ];

  trackByID(index: number, member: Account) {
    return member.id;
  }

}
