import { Injectable } from '@angular/core';
import { Message } from 'src/interfaces/message.interface';
import { FileUploadService } from './file-upload.service';
import { MessagesService } from './messages.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  constructor(
    private _msService: MessagesService,
    private _fileUpload: FileUploadService,
    private _user: UserService
  ) { }

  private webSocket: WebSocket;

  public openWebSocket() {
    this.webSocket = new WebSocket(`ws://localhost:3000`);

    this.webSocket.onopen = (event) => {
      console.log("Open: ", event);
    };

    this.webSocket.onmessage = (event) => {
      const msg: Message = <Message>JSON.parse(event.data);
      
      this._msService.messages.push({
        id: msg.id,
        userName: msg.userName,
        userMessage: msg.userMessage,
        date: new Date(msg.date),
        userImage: this._fileUpload.sanitizeIMG(msg.userImage),
        userColor: "#FFFFFF",
        auth: msg.userName == this._user.currentUser.userName
      });
    }

    this.webSocket.onclose = (event) => {
      console.warn("Close: ", event);
    }
  }

  public closeWebSocket() {
    this.webSocket.close();
  }

  public sendMessage() {
    this.webSocket.send(JSON.stringify({
      id: -1,
      userName: "WBS",
      userMessage: "Listening",
      userColor: "#FFFFFF",
      userImage: "",
      date: new Date(),
      auth: false
    }));
  }

}
