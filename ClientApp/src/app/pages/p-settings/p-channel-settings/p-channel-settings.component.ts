import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Channel } from 'src/interfaces/channel.interface';
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

      const ch = this.channels.find(ch => ch.id == +channelID);

      if (ch) {
        (ch as any).open = true;
      }
    }
  }

  public channels: Array<Channel> = this._ms.channels.slice();

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
    this.channels.forEach(ch => (ch as any).open = false);

    (this.channels[index] as any).open = true;
  }

}
