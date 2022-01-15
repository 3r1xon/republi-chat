import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/services/user.service';

@Component({
  templateUrl: './p-privacy.component.html',
  styleUrls: ['./p-privacy.component.scss']
})
export class PPrivacyComponent implements OnInit {

  constructor(
    private _user: UserService
  ) { }

  async ngOnInit() {
    const res = await this._user.getDevices().toPromise();
    this.devices = res.data;
  }

  public devices = [];

  async disconnectDevice(index: number) {
    const deviceID = this.devices[index].id_session;
    const res = await this._user.disconnectDevice(deviceID).toPromise();
    if (res.success) {
      this.devices.splice(index, 1);
    }
  }

}
