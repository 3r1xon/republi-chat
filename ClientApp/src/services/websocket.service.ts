import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { server } from 'src/environments/server';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  constructor(
  ) { 
    this.socket = io(server.WEB_SOCKET);
  }

  public isConnected: boolean = false;

  public socket: Socket;

  public listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }

  public emit(eventName: string, data: any) {
    console.log(this.socket)
    this.socket.emit(eventName, data);
  }

  public setAuth(ACCESS_TOKEN: string, REFRESH_TOKEN: string) {
    this.socket.auth = {
      ACCESS_TOKEN: ACCESS_TOKEN,
      REFRESH_TOKEN: REFRESH_TOKEN
    };
  }

}
