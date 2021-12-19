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
    this.socket.emit(eventName, data);
  }

}
