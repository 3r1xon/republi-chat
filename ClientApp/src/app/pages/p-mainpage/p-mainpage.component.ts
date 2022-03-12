import { MessagesService } from 'src/services/messages.service';
import { UserService } from 'src/services/user.service';
import { UtilsService } from 'src/services/utils.service';
import {
  Component,
  OnInit,
} from '@angular/core';
import { openLeft, openRight } from 'src/app/lib/animations';


@Component({
  templateUrl: './p-mainpage.component.html',
  styleUrls: ['./p-mainpage.component.scss'],
  animations: [
    openLeft("100ms", "-250px"),
    openRight("100ms", "-250px")
  ]
})
export class PMainpageComponent implements OnInit {

  constructor(
    public _user: UserService,
    public _ms: MessagesService,
    public _utils: UtilsService
  ) { }


  ngOnInit(): void {
    // Should be called only one time
    // since getChannels invoke next
    // and other tasks will run
    if (this._ms.channels.length == 0)
      this._ms.getChannels();

    Promise.resolve().then(() => {
      this.hasLoaded = true;
    });
  }

  public hasLoaded: boolean = false;

}
