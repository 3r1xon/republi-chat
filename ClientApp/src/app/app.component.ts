import { Component, OnInit } from '@angular/core';
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
    public _utils: UtilsService
    ) { }

  async ngOnInit() {
    await this._user.authorize();
  }
}
