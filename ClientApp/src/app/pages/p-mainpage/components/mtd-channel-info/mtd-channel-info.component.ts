import { Component } from '@angular/core';
import { Account } from 'src/interfaces/account.interface';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { MessagesService } from 'src/services/messages.service';
import { UserService } from 'src/services/user.service';
import { UtilsService } from 'src/services/utils.service';

@Component({
  selector: 'mtd-channel-info',
  templateUrl: './mtd-channel-info.component.html',
  styleUrls: ['./mtd-channel-info.component.scss'],
})
export class MTDChannelInfoComponent {

  constructor(
    public _ms: MessagesService,
    public _utils: UtilsService,
    private _user: UserService
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
      onClick: (pending: Account) => {
        this._ms.API_changePendingStatus(this._ms.currentChannel, pending.id, true)
          .toPromise()
          .then(() => {
            const i = this._ms.currentChannel.pendings
              .findIndex(user => user.id == pending.id);

            this._ms.currentChannel.pendings.splice(i, 1);
          });
      }
    },
    {
      name: "Reject",
      icon: "thumb_down",
      color: "danger",
      visible: () => this._ms.chPermissions.acceptMembers,
      onClick: (pending: Account) => {
        this._ms.API_changePendingStatus(this._ms.currentChannel, pending.id, false)
          .toPromise()
          .then(() => {
            const i = this._ms.currentChannel.pendings
              .findIndex(user => user.id == pending.id);

            this._ms.currentChannel.pendings.splice(i, 1);
          });
      }
    }
  ];

  public memberOptions: Array<REPButton> = [
    {
      name: "Kick from room",
      icon: "remove_circle_outline",
      color: "warning",
      visible: () => {
        if (this._ms.currentRoom.autoJoin) return false;

        return this._ms.chPermissions.kickMembers;
      },
      onClick: (member: Account) => {

        this._utils.showRequest(
          `Kick ${member.name}`,
          `Are you sure you want to kick out ${member.name}? He will be able to rejoin later...`,
          () => {

          }
        );
      }
    },
    {
      name: "Ban",
      icon: "delete_forever",
      color: "danger",
      visible: (member: Account) => this._ms.chPermissions.banMembers && member.id != this._user.currentUser.id,
      onClick: (member: Account) => {

        this._utils.showRequest(
          `Ban ${member.name}`,
          `Are you sure you want to ban ${member.name}? He will NOT be able to rejoin later till his ban is revoked!`,
          () => {
            this._ms.banUser(this._ms.currentChannel, member.id);
          }
        );
      }
    },
    {
      name: "Report",
      icon: "flag",
      onClick: (member: Account) => {

      }
    },
  ]

  trackByID(index: number, member: Account) {
    return member.id;
  }

}
