import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from 'src/interfaces/message.interface';
import { UserService } from './user.service';
import { server } from 'src/environments/server';
import { ServerResponse } from 'src/interfaces/response.interface';
import { FileUploadService } from './file-upload.service';
import { WebSocketService } from './websocket.service';
import { Channel } from 'src/interfaces/channel.interface';
import { Subject, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';


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

  public channels: Array<Channel> = [];

  public channels$: Subject<any> = new Subject<any>();

  public currentRoom: number;

  public msSubscriptions: Array<Subscription> = [];

  public getChannels() {
    this.http.get<ServerResponse>(`${server.BASE_URL}/channels/getChannels`)
      .pipe(first())
      .subscribe(
        (res) => {
          if (res.success) {
            this.channels = res.data;
            this.channels$.next();
          }
        } 
      );

  }

  // Get the current room messages and initializes all sockets
  public joinChannel(room: number) {
    this.http.get<ServerResponse>(`${server.BASE_URL}/messages/getChannelMessages/${room}`)
      .pipe(first())
      .subscribe(
        (res) => {
          this.currentRoom = room;
      
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
      
            this.destroyMsSubscriptions();
      
            this._webSocket.emit("joinChannel", {
              room: this.currentRoom,
              userID: this._user.currentUser.id
            });
      
            this.msSubscriptions.push(this._webSocket.listen("message").subscribe((message: string) => {
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
            }));
      
            this.msSubscriptions.push(this._webSocket.listen("deleteMessage").subscribe((_id: number) => {
              const index = this.messages.findIndex(msg => msg.id == _id);
              this.messages.splice(index, 1);
            }));
          }
        }
      );
  }

  // Send message on the current room
  public sendMessage(message: string) {
    this._webSocket.emit("message", message);
  }

  // Delete message on the current room
  public deleteMessage(_id: number) {
    this._webSocket.emit("deleteMessage", _id);
  }

  public createChannel(channel: Channel) {
    return this.http.post<ServerResponse>(`${server.BASE_URL}/channels/createChannel`, channel);
  }

  public addChannel(channel: Channel) {
    return this.http.post<ServerResponse>(`${server.BASE_URL}/channels/addChannel`, channel);
  }

  public destroyMsSubscriptions() {
    this.msSubscriptions.map((subscription) => {
      subscription.unsubscribe();
    });
    this.msSubscriptions = [];
  }

}
