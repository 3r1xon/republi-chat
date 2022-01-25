import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { server } from 'src/environments/server';
import { Observable } from 'rxjs';
import { UtilsService } from './utils.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  constructor(
    private _utils: UtilsService,
    private _user: UserService
  ) {
    this.socket = io(server.WEB_SOCKET, {
      reconnection: true,
      reconnectionDelay: 2500,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 20,
      transports: ['websocket'],
      upgrade: false
    });

    this.listen("connect")
      .subscribe(() => {
        this._utils.loading = false;
      });

    this.listen("disconnect")
      .subscribe(() => {
        if (this._user.userAuth)
          this._utils.loading = true;
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
