import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Channel, Room } from 'src/interfaces/channel.interface';
import { MessagesService } from 'src/services/messages.service';
import { UserService } from 'src/services/user.service';
import { UtilsService } from 'src/services/utils.service';
import {
  CdkDragDrop,
  moveItemInArray
} from '@angular/cdk/drag-drop';
import { Unsubscriber } from 'src/app/lib/rep-decorators';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { Message } from 'src/interfaces/message.interface';

@Component({
  selector: 'mtd-channels',
  templateUrl: './mtd-channels.component.html',
  styleUrls: ['./mtd-channels.component.scss']
})
@Unsubscriber
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

    if (this._ms.currentChannel == undefined) {
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
  }

  public filterChannel(ch: Message) {
    ch.message = (ch as any).code;
    return ch;
  }

  public channelsTab: number = 0;

  public channels: Array<{
    tabname: string,
    icon?: string
  }> = [
    {
      tabname: "Channels",
      icon: "list",
    },
    {
      tabname: "Friends",
      icon: "people",
    }
  ];

  public channelContext: Array<REPButton> = [
    {
      name: "Add room",
      icon: "add",
      onClick: () => {

      }
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
      this._ms.channels,
      event.previousIndex,
      event.currentIndex
    );

    this._ms.API_changeChOrder(this._ms.channels).toPromise();
  }

  async addNew() {
    await this.router.navigateByUrl('/settings/newchannel');
  }

}
