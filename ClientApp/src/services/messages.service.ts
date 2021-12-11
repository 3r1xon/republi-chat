import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from 'src/interfaces/message.interface';
import { UserService } from './user.service';
import { server } from 'src/environments/server';
import { ServerResponse } from 'src/interfaces/response.interface';
import { FileUploadService } from './file-upload.service';
import { WebSocketService } from './websocket.service';
import { Channel } from 'src/interfaces/channel.interface';


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
  }

  public messages: Array<Message> = [];

  public currentRoom;

  // Get the current room messages
  public async getChannelMessages() {
    const res = await this.http.get<ServerResponse>(`${server.BASE_URL}/messages/getMessages`).toPromise();

    if (res.success) {
      this.messages = [];

      this.messages = res.data?.map((msg) => {
        return {
          id: msg.id,
          name: msg.name,
          userMessage: msg.userMessage,
          date: new Date(msg.date),
          userImage: this._fileUpload.sanitizeIMG(msg.userImage),
          userColor: msg.userColor,
          auth: !!msg.auth
        };
      });
      
      this._webSocket.listen("message").subscribe((message: string) => {
        const msg = JSON.parse(message);

        const isUserMessage = msg.userCode == this._user.currentUser.userCode && msg.name == this._user.currentUser.name;

        this.messages.push({
          id: msg.id,
          name: msg.name,
          userMessage: msg.userMessage,
          date: new Date(msg.date),
          userImage: this._fileUpload.sanitizeIMG(msg.userImage),
          userColor: msg.userColor,
          auth: isUserMessage
        });
      });
  
      this._webSocket.listen("deleteMessage").subscribe((_id: number) => {
        const index = this.messages.findIndex(msg => msg.id == _id);
        this.messages.splice(index, 1);
      });
    }

  }

  // Send message on the current room
  public async sendMessage(message: string) {
    const msg = {
      id: this._user.currentUser?.id,
      userMessage: message
    };

    await this.http.post<ServerResponse>(`${server.BASE_URL}/messages/sendMessage`, msg).toPromise();
  }

  // Delete message on the current room
  public async deleteMessage(_id: number) {
    return await this.http.delete<ServerResponse>(`${server.BASE_URL}/messages/deleteMessage`, { 
      body: {
        _id: _id
      }
    }).toPromise();
  }

  public createChannel(channel: Channel) {
    return this.http.post(`${server.BASE_URL}/channels/createChannel`, channel);
  }

}
