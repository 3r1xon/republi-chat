import { MessagesService } from 'src/services/messages.service';
import { UserService } from 'src/services/user.service';
import { UtilsService } from 'src/services/utils.service';
import {
  Component,
  OnInit,
} from '@angular/core';
import { openLeft, openRight } from 'src/app/lib/rep-animations';
import { Unsubscriber } from 'src/app/lib/rep-decorators';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
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
    public breakpointObserver: BreakpointObserver
  ) { }


  async ngOnInit(): Promise<void> {
    // Should be called only one time
    if (this._ms.channels.length == 0)
      await this._ms.getChannels();

    if (this._ms.currentChannel == null) {
      const lastJoinedChannel = this._ms.getChannelByID(this._user.currentUser.lastJoinedChannel);

      if (lastJoinedChannel) {
        await this._ms.joinChannel(lastJoinedChannel);

      } else {

        const channel = this._ms.channels[0];

        if (channel && this._ms.currentChannel == null) {
          await this._ms.joinChannel(channel);
        }
      }
    }

    Promise.resolve().then(() => {
      this.hasLoaded = true;
    });

  }

  protected mobileListener: Subscription = this.breakpointObserver
    .observe(['(max-width: 400px)'])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this._utils.settings.showServerGroup = false;
      }
    });

  public hasLoaded: boolean = false;

  public roomCreation: boolean = false;

  public openRoomCreation() {
    this.roomCreation = true;
  }

}
