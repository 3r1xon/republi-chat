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
      tabname: "Members",
      icon: "public",
      sections: []
    },
    {
      tabname: "Pending",
      icon: "pending",
      sections: []
    },
  ];

}
