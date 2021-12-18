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
  ) { }

  public messages: Array<Message> = [];

  public channels: Array<Channel> = []

  public currentRoom: number;

  public msListener: any;

  public async getChannels() {
    const res = await this.http.get<ServerResponse>(`${server.BASE_URL}/channels/getChannels`).toPromise();

    if (res.success) {
      this.channels = res.data;
    }
  }

  // Get the current room messages
  public async getChannelMessages() {
    const res = await this.http.get<ServerResponse>(`${server.BASE_URL}/messages/getChannelMessages/${this.currentRoom}`).toPromise();

    if (res.success) {
      this.messages = res.data?.map((msg) => {
        return {
          id: msg.id,
          name: msg.name,
          message: msg.message,
          date: new Date(msg.date),
          picture: this._fileUpload.sanitizeIMG(msg.picture),
          color: msg.color,
          auth: !!msg.auth
        };
      });

      this.msListener?.unsubscribe();

      this.msListener = this._webSocket.listen("message").subscribe((message: string) => {
        const msg = JSON.parse(message);

        const isUserMessage = msg.code == this._user.currentUser.code && msg.name == this._user.currentUser.name;

        this.messages.push({
          id: msg.id,
          name: msg.name,
          message: msg.message,
          date: new Date(msg.date),
          picture: this._fileUpload.sanitizeIMG(msg.picture),
          color: msg.color,
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
      message: message,
      _channelID: this.currentRoom
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
    return this.http.post<ServerResponse>(`${server.BASE_URL}/channels/createChannel`, channel);
  }

  public addChannel(channel: Channel) {
    return this.http.post<ServerResponse>(`${server.BASE_URL}/channels/addChannel`, channel);
  }

}
