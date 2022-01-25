import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/services/user.service';
import { UtilsService } from 'src/services/utils.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private _user: UserService,
    private cookieService: CookieService,
    public _utils: UtilsService
    ) { }

  async ngOnInit() {
    if (this.cookieService.get("sid"))
      await this._user.authorize();
  }
}
