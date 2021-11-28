import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/services/user.service';
import { WebSocketService } from 'src/services/websocket.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private _user: UserService,
    private _webSocket: WebSocketService
    ) { }

  async ngOnInit() {
    await this._user.authorize();
    // this._webSocket.openWebSocket();
  }
}
