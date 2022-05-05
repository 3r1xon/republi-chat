import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Account } from 'src/interfaces/account.interface';
import { Channel } from 'src/interfaces/channel.interface';
import { ServerResponse } from 'src/interfaces/response.interface';
import { MessagesService } from 'src/services/messages.service';
import { UtilsService } from 'src/services/utils.service';

@Component({
  templateUrl: './p-channel-settings.component.html',
  styleUrls: ['./p-channel-settings.component.scss']
})
export class PChannelSettingsComponent implements OnInit {

  constructor(
    public _ms: MessagesService,
    private _utils: UtilsService,
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

  public channels: Array<Channel> = JSON.parse(JSON.stringify(this._ms.channels));

  public currentChMembers: Array<Account> = [];

  public permissionList: Array<any> = [

  ];

  public tabs: Array<{
    tabname: string,
    icon?: string
  }> = [
    {
      tabname: "Members",
      icon: "groups",
    }
  ];

  public leaveChannel(): void {
    this._utils.showRequest(
      "Are you sure you want to leave this channel?",
      "By doing so you'll leave the channel and all your messages will be deleted!",
      () => {

      }
    );
  }

  public expandChannel(index: number): void {
    // if (this.channels[index].id == th)
    this.channels.forEach(ch => (ch as any).open = false);

    this._ms.API_getChannelMembers(this.channels[index])
      .toPromise()
      .then((res: ServerResponse) => {

        this.currentChMembers = res.data;

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
