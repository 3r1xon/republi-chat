import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubMenu } from 'src/interfaces/submenu.interface';
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

  ngOnInit(): void {
    this.router.navigateByUrl('/settings/profile');
    this._msService.getChannelMessages();
  }

  public channels: Array<{ 
    tabname: string, 
    sections: Array<SubMenu> 
  }> = [
    {
      tabname: "Channels",
      sections: [
        {
          name: "Channel 1",
          onClick: () => {

          }
        }
      ]
    },
    {
      tabname: "Friends",
      sections: [
        {
          name: "Friend 1",
          onClick: () => {

          }
        }
      ]
    }
  ]

  async addNew() {
    await this.router.navigateByUrl('/settings/newchannel');
  }

}
