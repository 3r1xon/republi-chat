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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { REPManager } from 'src/app/lib/rep-manager';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Component({
  templateUrl: './p-mainpage.component.html',
  styleUrls: ['./p-mainpage.component.scss'],
  animations: [
    openLeft("100ms", "-250px"),
    openRight("100ms", "-250px")
  ]
})
@Unsubscriber
export class PMainpageComponent extends REPManager implements OnInit {

  constructor(
    public _user: UserService,
    public _ms: MessagesService,
    public _utils: UtilsService,
    public http: HttpClient,
    private fb: FormBuilder
  ) {
    super(http);
  }


  ngOnInit(): void {
    // Should be called only one time
    // since getChannels invoke next
    // and other tasks will run

    this.setValues(this.form);

    this.setSaveAPI("POST", `${environment.BASE_URL}/channels/addChRoom`);

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

  public form: FormGroup = this.fb.group({
    roomName: ['',
      [
        Validators.maxLength(30),
        Validators.minLength(1),
        // No more than one white space allowed before each word
        Validators.pattern(/^([a-zA-Z0-9]+\s)*[a-zA-Z0-9]+$/)
      ]
    ],
    autoJoin: [true,
      [
        Validators.required
      ]
    ],
  });

  public hasLoaded: boolean = false;

  public roomCreation: boolean = false;

  public openRoomCreation() {
    this.roomCreation = true;
  }

}
