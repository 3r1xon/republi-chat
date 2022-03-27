import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/services/user.service';
import { UtilsService } from 'src/services/utils.service';


@Component({
  selector: 'rep-main',
  templateUrl: './app.component.html',
  host: {
    "[@.disabled]": "!_utils.settings.animations",
  },
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private cookieService: CookieService,
    private _user: UserService,
    public _utils: UtilsService
  ) { }

  async ngOnInit() {
    if (this.cookieService.get("sid"))
      await this._user.authorize();
  }
}
