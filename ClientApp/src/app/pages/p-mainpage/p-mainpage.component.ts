import { MessagesService } from 'src/services/messages.service';
import { UserService } from 'src/services/user.service';
import { UtilsService } from 'src/services/utils.service';
import {
  Component,
  OnInit,
} from '@angular/core';
import { openLeft, openRight } from 'src/app/lib/rep-animations';
import { Unsubscriber } from 'src/app/lib/rep-decorators';
import { Subscription } from 'rxjs';


@Component({
  templateUrl: './p-mainpage.component.html',
  styleUrls: ['./p-mainpage.component.scss'],
  animations: [
    openLeft("100ms", "-250px"),
    openRight("100ms", "-250px")
  ]
})
@Unsubscriber
export class PMainpageComponent implements OnInit {

  constructor(
    public _user: UserService,
    public _ms: MessagesService,
    public _utils: UtilsService,
  ) { }


  ngOnInit(): void {
    // Should be called only one time
    // since getChannels invoke next
    // and other tasks will run
    if (this._ms.channels.length == 0)
      this._ms.getChannels();

    this.fillSections();

    Promise.resolve().then(() => {
      this.hasLoaded = true;
    });
  }

  protected readonly channelSubscription: Subscription = this._ms.channelChanges
    .subscribe(() => {
      this.fillSections();
    });

  private fillSections() {
    if (this._ms.currentChannel == undefined) {
      const lastJoinedChannel = this._ms.getChannelByID(this._user.currentUser.lastJoinedChannel);

      if (lastJoinedChannel) {
        this._ms.joinChannel(lastJoinedChannel);
      } else {

        const channel = this._ms.channels[0];

        if (channel && this._ms.currentChannel == undefined) {
          this._ms.joinChannel(channel);
        }
      }
    }
  }

  public hasLoaded: boolean = false;

  public roomCreation: boolean = false;

  public openRoomCreation() {
    this.roomCreation = true;
  }

}
