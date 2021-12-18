import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { MessagesService } from 'src/services/messages.service';
import { UserService } from 'src/services/user.service';

@Component({
  templateUrl: './p-mainpage.component.html',
  styleUrls: ['./p-mainpage.component.scss']
})
export class PMainpageComponent implements OnInit, OnDestroy {

  constructor(
    public _user: UserService,
    public _msService: MessagesService,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    await this._msService.getChannels();

    this.channels = [
      {
        tabname: "Channels",
        sections: this._msService.channels
      },
      {
        tabname: "Friends",
        sections: []
      }
    ];

    this.channels[0].sections = this._msService.channels;

    this._msService.currentRoom = this.channels[0].sections[0]._id;

    if (this._msService.currentRoom) {
      await this._msService.getChannelMessages();
    }
  }

  ngOnDestroy(): void {
    this._msService.msListener.unsubscribe();
  }

  public currentTab: number = 0;

  public options: Array<REPButton> = [
    {
      name: "Remove",
      icon: "delete",
      color: "danger",
      onClick: () => {}
    }
  ];

  public channels: Array<{ 
    tabname: string, 
    sections: Array<any> 
  }> = [];

  async selectChannel(room: number) {
    this._msService.currentRoom = room;

    await this._msService.getChannelMessages();
  }

  async sendChannelMessage(message: string) {
    await this._msService.sendMessage(message);
  }

  async addNew() {
    await this.router.navigateByUrl('/settings/newchannel');
  }

}
