import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from 'src/interfaces/message.interface';
import { UserService } from './user.service';
import { database } from 'src/environments/database';
import { ServerResponse } from 'src/interfaces/response.interface';
import { FileUploadService } from './file-upload.service';
import { WebSocketService } from './websocket.service';


@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(
    private _user: UserService,
    private _fileUpload: FileUploadService,
    private _webSocket: WebSocketService,
    private http: HttpClient
  ) { 
    this._webSocket.listen("message").subscribe((message: string) => {
      const msg = JSON.parse(message);

      this.messages.push({
        id: msg.id,
        name: msg.name,
        userMessage: msg.userMessage,
        date: new Date(msg.date),
        userImage: this._fileUpload.sanitizeIMG(msg.userImage),
        userColor: msg.userColor,
        auth: msg.userName == this._user.currentUser.userName
      });
    });

    this._webSocket.listen("deleteMessage").subscribe((_id: number) => {
      const index = this.messages.findIndex(msg => msg.id == _id);
      this.messages.splice(index, 1);
    });
  }

  public messages: Array<Message> = [];

  public async getMessages() {
    const res = await this.http.get<ServerResponse>(`${database.BASE_URL}/messages/getMessages`).toPromise();

    if (res.success) {
      this.messages = [];

      res.data?.forEach((msg) => {
        this.messages.push({
          id: msg.id,
          name: msg.name,
          userMessage: msg.userMessage,
          date: new Date(msg.date),
          userImage: this._fileUpload.sanitizeIMG(msg.userImage),
          userColor: msg.userColor,
          auth: !!msg.auth
        });
      });
    }
  }

  public async sendMessage(message: string) {
    const msg = {
      id: this._user.currentUser?.id,
      userMessage: message,
      date: new Date().getTime()
    };

    await this.http.post<ServerResponse>(`${database.BASE_URL}/messages/sendMessage`, msg).toPromise();
  }

  public async deleteMessage(_id: number) {
    return await this.http.delete<ServerResponse>(`${database.BASE_URL}/messages/deleteMessage`, { 
      body: {
        _id: _id
      }
    }).toPromise();
  }

}
