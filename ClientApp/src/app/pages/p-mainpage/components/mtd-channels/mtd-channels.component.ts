import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Channel, Room } from 'src/interfaces/channel.interface';
import { Message } from 'src/interfaces/message.interface';
import { MessagesService } from 'src/services/messages.service';
import { UserService } from 'src/services/user.service';
import { UtilsService } from 'src/services/utils.service';
import {
  CdkDragDrop,
  moveItemInArray
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'mtd-channels',
  templateUrl: './mtd-channels.component.html',
  styleUrls: ['./mtd-channels.component.scss']
})
export class MTDChannelsComponent implements OnInit {

  constructor(
    public _ms: MessagesService,
    public _utils: UtilsService,
    private _user: UserService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.fillSections();
  }

  protected readonly channelSubscription: Subscription = this._ms.channelChanges
  .subscribe(() => {
    this.fillSections();
  });

  private fillSections() {
    const channelsRef = this.channels.find(tab => tab.tabname == "Channels");

    channelsRef.sections = this._ms.channels.map((ch) => {
      return <Message>{
        id: ch.id,
        name: ch.name,
        message: ch.code,
        picture: ch.picture,
        color: ch.color,
        backgroundColor: ch.backgroundColor
      };
    });

    const lastJoinedChannel = this._ms.getChannelByID(this._user.currentUser.lastJoinedChannel);

    if (lastJoinedChannel) {
      this._ms.joinChannel(lastJoinedChannel);
    } else {

      const channel = this._ms.channels[0];

      if (channel && this._ms.currentChannel == undefined) {
        this._ms.joinChannel(channel);
      }
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
      sections: this._ms.channels
    },
    {
      tabname: "Friends",
      icon: "people",
      sections: []
    }
  ];

  selectChannel(channel: Channel) {
    if (channel.id == this._ms.currentChannel.id)
      return;

    this._ms.joinChannel(channel);
  }

  selectRoom(room: Room) {
    if (!this._ms.isInRoom(room)) {
      this._ms.joinRoom(this._ms.currentChannel, room);
    }
  }

  orderChannel(event: CdkDragDrop<Array<string>>) {
    moveItemInArray(
      this.channels[this.channelsTab].sections,
      event.previousIndex,
      event.currentIndex
    );

    this._ms.API_changeChOrder(this.channels[this.channelsTab].sections).toPromise();
  }

  async addNew() {
    await this.router.navigateByUrl('/settings/newchannel');
  }

}
