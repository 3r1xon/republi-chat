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
    const sub = this._user.API_getDevices()
      .subscribe(
        (res) => {
          this.devices = res.data;
        },
        () => { },
        () => {
          sub.unsubscribe();
        }
      );
  }

  public devices = [];

  disconnectDevice(index: number) {
    const deviceID = this.devices[index].id_session;
    const sub = this._user.API_disconnectDevice(deviceID)
      .subscribe(
        (res) => {
          if (res.success) {
            this.devices.splice(index, 1);
          }
        }, 
        () => { },
        () => {
          sub.unsubscribe();
        }
      );
  }

}
