import { MessagesService } from 'src/services/messages.service';
import { UserService } from 'src/services/user.service';
import { UtilsService } from 'src/services/utils.service';
import { Unsubscriber } from 'src/app/lib/rep-decorators';
import {
  Component,
  OnInit,
} from '@angular/core';
import { openLeft, openRight } from 'src/app/lib/animations';


@Component({
  templateUrl: './p-mainpage.component.html',
  styleUrls: ['./p-mainpage.component.scss'],
  animations: [
    openRight("100ms", "-250px"),
    openLeft("100ms", "-250px")
  ]
})
@Unsubscriber
export class PMainpageComponent implements OnInit {

  constructor(
    public _user: UserService,
    public _msService: MessagesService,
    public _utils: UtilsService
  ) { }


  ngOnInit(): void {
    // Should be called only one time
    // since getChannels invoke next
    // and other tasks will run
    if (this._msService.channels.length == 0)
      this._msService.getChannels();

    Promise.resolve().then(() => {
      this.hasLoaded = true;
    });
  }

  public hasLoaded: boolean = false;

}
