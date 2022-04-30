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
import { REPButton } from 'src/interfaces/repbutton.interface';

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

  public channelActions: Array<REPButton> = [
    {
      name: "Add",
      icon: "add_box",
      tooltip: "Add a new room",
      visible: () => this._ms.chPermissions.createRooms,
      onClick: () => {
        this.mainpage.openRoomCreation();
      }
    },
    {
      name: "Settings",
      icon: "tune",
      tooltip: "Go to channel settings",
      onClick: () => {
        this.router.navigateByUrl('/settings/channelsettings');
      }
    }
  ];

  public roomOptions: Array<REPButton> = [
    {
      name: "Delete",
      icon: "delete",
      color: "danger",
      visible: () => this._ms.chPermissions.createRooms,
      onClick: (roomID) => {

        const room = {
          roomID: roomID
        };

        const deleteRoom = () => {

          this._ms.API_deleteRoom(this._ms.currentChannel, room as Room)
            .toPromise()
            .then(() => {
              this._utils.showRequest("Success", "Room deleted successfully!");
            })
            .catch(() => {
              this._utils.showRequest("Error", "There has been an error while deleting the room!");

            });
        };

        this._utils.showRequest(
          "Are you sure you?",
          "By doing so this room will be deleted along with all the messages. This action is permanent!",
          deleteRoom
        );


      }
    },
    {
      name: "Leave",
      icon: "remove",
      color: "warning",
      visible: () => !this._ms.chPermissions.createRooms,
      onClick: () => {

      }
    },
  ];

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
