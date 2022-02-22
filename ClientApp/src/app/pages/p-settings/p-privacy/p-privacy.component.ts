import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/services/user.service';
import { UtilsService } from 'src/services/utils.service';

@Component({
  templateUrl: './p-privacy.component.html',
  styleUrls: ['./p-privacy.component.scss']
})
export class PPrivacyComponent implements OnInit {

  constructor(
    private _user: UserService,
    public _utils: UtilsService
  ) { }

  ngOnInit() {
    this._user.API_getDevices()
      .toPromise()
      .then(
        (res) => {
          this.devices = res.data;
        }
      );
  }

  public devices = [];

  disconnectDevice(index: number) {
    const deviceID = this.devices[index].id_session;
    this._user.API_disconnectDevice(deviceID)
      .toPromise()
      .then(
        (res) => {
          if (res.success) {
            this.devices.splice(index, 1);
          }
        }
      );
  }

}
