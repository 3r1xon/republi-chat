import { Component, Host } from '@angular/core';
import { Router } from '@angular/router';
import { Channel, Room } from 'src/interfaces/channel.interface';
import { MessagesService } from 'src/services/messages.service';
import { UtilsService } from 'src/services/utils.service';
import {
  CdkDragDrop,
  moveItemInArray
} from '@angular/cdk/drag-drop';
import { Message } from 'src/interfaces/message.interface';
import { PMainpageComponent } from '../../p-mainpage.component';

@Component({
  selector: 'mtd-channels',
  templateUrl: './mtd-channels.component.html',
  styleUrls: ['./mtd-channels.component.scss']
})
export class MTDChannelsComponent {

  constructor(
    public _ms: MessagesService,
    public _utils: UtilsService,
    @Host() public mainpage: PMainpageComponent,
    private router: Router
  ) { }

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
