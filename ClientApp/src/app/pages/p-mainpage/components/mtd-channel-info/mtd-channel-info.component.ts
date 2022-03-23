import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Unsubscriber } from 'src/app/lib/rep-decorators';
import { MessagesService } from 'src/services/messages.service';

@Component({
  selector: 'mtd-channel-info',
  templateUrl: './mtd-channel-info.component.html',
  styleUrls: ['./mtd-channel-info.component.scss']
})
@Unsubscriber
export class MTDChannelInfoComponent implements OnInit {

  constructor(
    private _ms: MessagesService
  ) { }

  ngOnInit(): void {
    this.fillSections();
  }

  protected readonly onRoomJoin: Subscription = this._ms.onRoomChange
    .subscribe(() => {
      this.fillSections();
    });

  private fillSections() {
    const channelsRef = this.serverInfo.find(tab => tab.tabname == "Members");

    if (this._ms.currentRoom) {

      channelsRef.sections = this._ms.currentRoom.members.map((ch: any) => {
        return this._ms.mapMsg(ch);
      });

    }
  }

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
