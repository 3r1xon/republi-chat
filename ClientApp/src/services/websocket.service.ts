import { Injectable } from '@angular/core';
import { MessagesService } from './messages.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  constructor(
    private _msService: MessagesService
  ) { }

  private webSocket: WebSocket;

  public openWebSocket() {
    this.webSocket = new WebSocket(`ws://localhost:3000`);

    this.webSocket.onopen = (event) => {
      console.log("Open: ", event);
    };

    this.webSocket.onmessage = (event) => {
      console.log(event);
      this._msService.messages.push(JSON.parse(event.data));
    }

    this.webSocket.onclose = (event) => {
      console.warn("Close: ", event);
    }
  }

  public closeWebSocket() {
    this.webSocket.close();
  }

  public sendMessage() {
    this.webSocket.send(JSON.stringify(this._msService.messages[this._msService.messages.length-1]));
  }

}
