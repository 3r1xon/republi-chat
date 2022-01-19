import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { server } from 'src/environments/server';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  constructor(
    private cookieService: CookieService
  ) { 
    this.socket = io(server.WEB_SOCKET, {
      reconnection: true,
      reconnectionDelay: 5000,
      reconnectionDelayMax: 10000,
      reconnectionAttempts: 20,
      transports: ['websocket'],
      upgrade: false,
      query: {
        SESSION_ID: "Test"
      }
    });

    this.listen("disconnect").subscribe(() => {
      console.log("disconnect!");
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
