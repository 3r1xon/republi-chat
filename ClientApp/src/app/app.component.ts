import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { server } from 'src/environments/server';
import { UserService } from 'src/services/user.service';
import { UtilsService } from 'src/services/utils.service';
import { WebSocket } from './lib/websocket';


@Component({
  selector: 'rep-main',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends WebSocket implements OnInit {

  constructor(
    private _user: UserService,
    private cookieService: CookieService,
    public _utils: UtilsService
  ) {
    super(server.WEB_SOCKET);
  }

  async ngOnInit() {

    this.listen("connect")
      .subscribe(() => {
        this._utils.loading = false;
        this._utils.wsConnected = true;
      });

    this.listen("disconnect")
      .subscribe(() => {
        this._utils.loading = true;
        this._utils.wsConnected = false;
      });

    this.listen(this.cookieService.get("sid"))
      .subscribe((status) => {
        // if (status == "forceKick")
          // this._user.logOut(true);
      });

    if (this.cookieService.get("sid"))
      await this._user.authorize();
  }
}
