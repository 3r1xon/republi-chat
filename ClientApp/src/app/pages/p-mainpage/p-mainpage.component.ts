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

    this.serverInfo = [
      {
        tabname: "Online",
        sections: []
      },
      {
        tabname: "Offline",
        sections: []
      },
      {
        tabname: "Pending",
        sections: []
      },
    ];

    this.channels[0].sections = this._msService.channels;

    const room = this.channels[0]?.sections[0]?._id;

    if (room) {
      await this._msService.joinChannel(room);
    }
  }

  ngOnDestroy(): void {
    this._msService.destroyMsSubscriptions();
  }

  public options: Array<REPButton> = [
    {
      name: "Remove",
      icon: "delete",
      color: "danger",
      onClick: () => {}
    }
  ];

  public channelsTab: number = 0;

  public channels: Array<{ 
    tabname: string, 
    sections: Array<any> 
  }> = [];

  public serverInfoTab: number = 0;

  public serverInfo: Array<{ 
    tabname: string, 
    sections: Array<any> 
  }> = [];


  async selectChannel(room: number) {
    await this._msService.joinChannel(room);
  }

  async sendChannelMessage(message: string) {
    await this._msService.sendMessage(message);
  }

  async addNew() {
    await this.router.navigateByUrl('/settings/newchannel');
  }

}
