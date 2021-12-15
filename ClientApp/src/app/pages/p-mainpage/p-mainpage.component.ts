import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { MessagesService } from 'src/services/messages.service';
import { UserService } from 'src/services/user.service';

@Component({
  templateUrl: './p-mainpage.component.html',
  styleUrls: ['./p-mainpage.component.scss']
})
export class PMainpageComponent implements OnInit {

  constructor(
    public _user: UserService,
    public _msService: MessagesService,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    await this._msService.getChannels();

    this.channels[0].sections = this._msService.channels;

    this._msService.currentRoom = this._msService.channels[0]?._id;

    if (this._msService.currentRoom) {
      await this._msService.getChannelMessages();
    }

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
  }> = [
    {
      tabname: "Channels",
      sections: []
    },
    {
      tabname: "Friends",
      sections: []
    }
  ];

  async selectChannel(room: number) {
    this._msService.currentRoom = room;

    await this._msService.getChannelMessages();
  }

  async sendChannelMessage(message: string) {
    console.log(message)
    await this._msService.sendMessage(message);
  }

  async addNew() {
    await this.router.navigateByUrl('/settings/newchannel');
  }

}
