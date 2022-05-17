import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Account } from 'src/interfaces/account.interface';
import { Channel } from 'src/interfaces/channel.interface';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { ServerResponse } from 'src/interfaces/response.interface';
import { MessagesService } from 'src/services/messages.service';
import { UserService } from 'src/services/user.service';
import { UtilsService } from 'src/services/utils.service';

@Component({
  templateUrl: './p-channel-settings.component.html',
  styleUrls: ['./p-channel-settings.component.scss']
})
export class PChannelSettingsComponent implements OnInit {

  constructor(
    public _ms: MessagesService,
    private _utils: UtilsService,
    private _user: UserService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const channelID = this.route.snapshot.paramMap.get("channelID");

    if (channelID) {

      const channel = this.channels.find(ch => ch.id == +channelID);

      if (channel) {
        this.expandChannel(channel);
      }
    }
  }

  public channelContext: Array<REPButton> = [
    {
      name: "Delete",
      icon: "delete",
      color: "danger",
      visible: (channel: Channel) => channel.founder == this._user.currentUser.id,
      onClick: (channel: Channel) => {

        this._utils.showRequest(
          "WARNING!",
          `You're about to DELETE PERMANENTLY ${channel.name}, all messages and members will be lost, are you sure you want to continue?`,
          () => {

            this._ms.API_deleteChannel(channel)
              .toPromise()
              .then(() => {
                const i = this.channels.findIndex(ch => ch.id == channel.id);

                if (i != -1) {
                  this.channels.splice(i, 1);
                }
              })
              .catch(() => {
                this._utils.showRequest(
                  "Error",
                  "There has been an error while deleting the channel!"
                );
              });
          }
        );
      }
    },
    {
      name: "Leave",
      icon: "delete",
      color: "danger",
      tooltip: "Leave channel",
      visible: (channel: Channel) => channel.founder != this._user.currentUser.id,
      onClick: (channel: Channel) => {

        this._utils.showRequest(
          "Are you sure?",
          `You're about to leave ${channel.name}, are you sure you want to continue?`,
          () => {

            this._ms.API_leaveChannel(channel)
              .toPromise()
              .catch(() => {
                this._utils.showRequest(
                  "Error",
                  "There has been an error while leaving the channel!"
                );
              });
          }
        );

      }
    }
  ];

  public memberActions: Array<REPButton> = [
    {
      name: "Ban",
      icon: "delete_forever",
      background: "danger",
      visible: () => !this.selectedUser?.banned,
      onClick: () => {

        this._utils.showRequest(
          `Ban ${this.selectedUser.name}`,
          `Are you sure you want to ban ${this.selectedUser.name}? He will NOT be able to rejoin later till his ban is revoked!`,
          () => {
            this._ms.banUser(this.selectedUser.id);
          }
        );
      }
    },
    {
      name: "Revoke ban",
      icon: "thumb_up",
      background: "success",
      visible: () => this.selectedUser?.banned,
      onClick: () => {

        this._utils.showRequest(
          `Revoke ban for ${this.selectedUser.name}`,
          `Are you sure you want to revoke ban for user ${this.selectedUser.name}? He will be able to join again!`,
          () => {

          }
        );
      }
    },
    {
      name: "Kick",
      icon: "person_remove",
      background: "warning",
      visible: () => !this.selectedUser?.banned,
      onClick: () => {

        this._utils.showRequest(
          `Kick ${this.selectedUser.name}`,
          `Are you sure you want to kick ${this.selectedUser.name}? He will be able to rejoin later if accepted!`,
          () => {
            this._ms.kickUser(this.selectedUser.id);
          }
        );
      }
    },
  ];

  public channels: Array<Channel> = JSON.parse(JSON.stringify(this._ms.channels));

  public selectedChannel: Channel;

  public selectedUser: Account;

  public permissionList: Array<{
    name: string,
    description: string,
    permissionKey: string,
    value: number | boolean
  }> = [
    {
      name: "Delete messages",
      description: "When on this user will be able to delete other member messages",
      permissionKey: "deleteMessages",
      value: false
    },
    {
      name: "Kick members",
      description: "When on this user will be able to kick other members out of this channel",
      permissionKey: "kickMembers",
      value: false
    },
    {
      name: "Ban members",
      description: "When on this user will be able to ban members on this channel",
      permissionKey: "banMembers",
      value: false
    },
    {
      name: "Send messages",
      description: "When on this user will be able to ban members on this channel",
      permissionKey: "sendMessages",
      value: false
    },
    {
      name: "Create rooms",
      description: "When on this user will be able to create text or vocal room on this channel",
      permissionKey: "createRooms",
      value: false
    },
    {
      name: "Accept members",
      description: "When on this user will be able to accept other people and let them be members of this channel",
      permissionKey: "acceptMembers",
      value: false
    },
    {
      name: "Manage permissions",
      description: "BE CAREFUL, when on, this user will be able to give permissions to other members under his level",
      permissionKey: "managePermissions",
      value: false
    },
    {
      name: "Importance level",
      description: "Members with higher importance level will have more power",
      permissionKey: "importanceLevel",
      value: 0
    },
  ];

  public getType(value): string {
    return typeof(value);
  }

  public expandChannel(channel: Channel): void {
    if (channel.id == this.selectedChannel?.id) return;

    this.channels.forEach(ch => (ch as any).open = false);

    this._ms.API_getChannelMembers(channel)
      .toPromise()
      .then((res: ServerResponse) => {
        this.selectedChannel = channel;

        this.selectedChannel.members = res.data;

        setTimeout(() => {
          (channel as any).open = true;
        });
      })
      .catch(() => {
        this._utils.showRequest(
          "Error",
          "Unable to get channel members!",
        );
      });

  }

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
      tabname: "Banned",
      icon: "thumb_down",
    },
  ];

  public expandMember(user: Account) {
    this.selectedChannel.members.forEach(member => (member as any).open = false);

    if (user.id == this.selectedChannel.founder)
      return;

    if (this.selectedUser?.id == user.id)
      return;

    (user as any).open = true;

    this._ms.API_getMemberPermissions(this.selectedChannel, user)
      .toPromise()
      .then((res: ServerResponse) => {

        (this.selectedUser as any) = user;

        const permissions = res.data;

        let i = 0;
        for (const key in permissions) {
          this.permissionList[i].value = permissions[key];
          i++;
        }

      })
      .catch(() => {
        this._utils.showRequest(
          "Error",
          "Unable to get member permissions!",
        );
      });

  }

  public changePermission(permission) {
    this._ms.changePermission(this.selectedChannel, this.selectedUser, permission);
  }

}
