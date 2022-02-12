import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { server } from 'src/environments/server';
import { UserService } from './user.service';
import { UtilsService } from './utils.service';

const socketOptions = {
  reconnection: true,
  reconnectionDelay: 2500,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 20,
  transports: ['websocket'],
  upgrade: false
};

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  constructor(
    private _utils: UtilsService,
    private _user: UserService,
    private cookieService: CookieService
  ) {
    this.socket = io(server.WEB_SOCKET, socketOptions);

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
        if (status == "forceKick")
          this._user.logOut(true);
      });
  }

  public socket: Socket;

  public listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }

  public listenOnce(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.once(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }

  public emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }
}
