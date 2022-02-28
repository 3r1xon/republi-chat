import { Component } from '@angular/core';

@Component({
  selector: 'channel-info',
  templateUrl: './channel-info.component.html',
  styleUrls: ['./channel-info.component.scss']
})
export class ChannelInfoComponent {

  public serverInfoTab: number = 0;

  public serverInfo: Array<{
    tabname: string,
    icon?: string,
    sections: Array<any>
  }> = [
    {
      tabname: "Online",
      icon: "public",
      sections: []
    },
    {
      tabname: "Offline",
      icon: "no_accounts",
      sections: []
    },
    {
      tabname: "Pending",
      icon: "pending",
      sections: []
    },
  ];

}
