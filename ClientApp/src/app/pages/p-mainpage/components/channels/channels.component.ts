import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Channel } from 'src/interfaces/channel.interface';
import { Message } from 'src/interfaces/message.interface';
import { Room } from 'src/interfaces/room.interface';
import { MessagesService } from 'src/services/messages.service';
import { UtilsService } from 'src/services/utils.service';

@Component({
  selector: 'channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit {

  constructor(
    public _msService: MessagesService,
    public _utils: UtilsService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.fillSections();
  }

  protected readonly channelSubscription: Subscription = this._msService.channels$
  .subscribe(() => {
    this.fillSections();
  });

  private fillSections() {
    const channelsRef = this.channels.find(tab => tab.tabname == "Channels");

    channelsRef.sections = this._msService.channels.map((ch) => {
      return <Message>{
        id: ch.id,
        name: ch.name,
        message: ch.code,
        picture: ch.picture,
        color: ch.color,
        backgroundColor: ch.backgroundColor
      };
    });

    const channel = this._msService.channels[0];

    if (channel) {
      this._msService.joinChannel(channel);
    }
  }

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

  selectChannel(channel: Channel) {
    if (channel.id == this._msService.currentChannel.id) return;

    this._msService.joinChannel(channel);
  }

  selectRoom(room: Room) {
    if (room.roomID == this._msService.currentRoom.roomID) return;

    this._msService.joinRoom(this._msService.currentChannel, room);
  }

  expandChannel(index: number) {
    this.channels[this.channelsTab].sections.map((ch: any) => {
      ch.open = false;
    });

    (this.channels[this.channelsTab].sections[index] as any).open = true;
  }

  async addNew() {
    await this.router.navigateByUrl('/settings/newchannel');
  }

}
