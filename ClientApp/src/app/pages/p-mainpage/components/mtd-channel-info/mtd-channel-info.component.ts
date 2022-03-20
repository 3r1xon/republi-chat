import { Component } from '@angular/core';

@Component({
  selector: 'mtd-channel-info',
  templateUrl: './mtd-channel-info.component.html',
  styleUrls: ['./mtd-channel-info.component.scss']
})
export class MTDChannelInfoComponent {

  public serverInfoTab: number = 0;

  public serverInfo: Array<{
    tabname: string,
    icon?: string,
    sections: Array<any>
  }> = [
    {
      tabname: "Members",
      icon: "groups",
      sections: []
    },
    {
      tabname: "Pending",
      icon: "pending",
      sections: []
    },
  ];

}
