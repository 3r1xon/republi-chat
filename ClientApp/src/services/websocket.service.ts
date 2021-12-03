import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { database } from 'src/environments/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  constructor(
  ) { 
    this.socket = io(database.WEB_SOCKET);
  }

  public isConnected: boolean = false;

  public socket;

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
