import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

      const chIndex = this.channels.findIndex(ch => ch.id == +channelID);

      if (chIndex != -1) {
        this.expandChannel(chIndex);
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

  public channels: Array<Channel> = JSON.parse(JSON.stringify(this._ms.channels));

  public selectedChannel: Channel;

  public permissionList: Array<any> = [];

  public expandChannel(index: number): void {
    if (this.channels[index].id == this.selectedChannel?.id) return;

    this.channels.forEach(ch => (ch as any).open = false);

    this._ms.API_getChannelMembers(this.channels[index])
      .toPromise()
      .then((res: ServerResponse) => {

        this.selectedChannel = this.channels[index];

        this.selectedChannel.members = res.data;

        (this.channels[index] as any).open = true;
      })
      .catch(() => {
        this._utils.showRequest(
          "Error",
          "Unable to get channel members!",
        );
      });

  }

}
