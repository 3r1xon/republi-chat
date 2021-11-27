import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessagesService } from 'src/services/messages.service';
import { WebSocketService } from 'src/services/websocket.service';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  constructor(
    public _msService: MessagesService,
    private _webSocket: WebSocketService
  ) { }

  ngOnInit(): void {
    this._msService.getMessages();
    this._webSocket.openWebSocket();
  }

  ngOnDestroy(): void {
    this._webSocket.closeWebSocket();
  }

  deleteMessage(index: number) {
    
  } 

  openSelectedUser(event: any) {
    console.log(event);
  }

  editMessage(index: number) {

  }

}