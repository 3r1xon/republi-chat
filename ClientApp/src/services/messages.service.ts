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
import { REPButton } from 'src/interfaces/repbutton.interface';
import { UtilsService } from './utils.service';


@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(
    private _user: UserService,
    private _fileUpload: FileUploadService,
    private _webSocket: WebSocketService,
    private _utils: UtilsService,
    private http: HttpClient
  ) { 

  }

  public messages: Array<Message> = [];
  
  public msOptions: Array<REPButton> = [
    {
      name: "Delete",
      icon: "delete",
      color: "danger",
      onClick: () => {
        this._utils.showRequest(
          "Delete message",
          "Are you sure you want to delete this message?",
          () => {
          }
        );
      }
    },
    {
      name: "Edit",
      icon: "edit",
      onClick: () => {
      }
    },
    {
      name: "Report",
      icon: "flag",
      onClick: () => {
      }
    },
  ];;

  public channels: Array<Channel> = [];

  public channels$: Subject<any> = new Subject<any>();

  public chPermissions;

  public currentRoom: number;

  public msSubscriptions: Array<Subscription> = [];

  /**
   * Get the current user channels.
   *
   */
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

  /**
   * Get the current room messages and initializes all sockets.
   *
   * @param room The channel ID you want to join into.
   *
   */
  public joinChannel(room: number) {
    this.http.get<ServerResponse>(`${server.BASE_URL}/messages/getChannelMessages/${room}`)
      .pipe(first())
      .subscribe(
        (res) => {
          this.currentRoom = room;
      
          if (res.success) {
            this.messages = res.data.messages?.map((msg) => {
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

            this.chPermissions = res.data.chPermissions;

            if (this.chPermissions.deleteMessage)
              this.msOptions.push({
                name: "delete"
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

  /**
   * Sends a message in the current room.
   *
   * @param message The string that contains the message.
   */
  public sendMessage(message: string) {
    this._webSocket.emit("message", message);
  }

  /**
   * Delete message on the current room.
   *
   * @param _id The message ID you want to remove.
   */
  public deleteMessage(_id: number) {
    this._webSocket.emit("deleteMessage", _id);
  }

  /**
   * API that create a channel.
   *
   * @param channel The channel object you want to create.
   * 
   * @returns An HTTP request
   *
   */
  public createChannel(channel: Channel) {
    return this.http.post<ServerResponse>(`${server.BASE_URL}/channels/createChannel`, channel);
  }

  /**
   * API that add a channel to the cannels list.
   *
   * @param channel The channel object you want to add.
   * 
   * @returns An HTTP request
   *
   */
  public addChannel(channel: Channel) {
    return this.http.post<ServerResponse>(`${server.BASE_URL}/channels/addChannel`, channel);
  }

  /**
   * Destroys the joined channel subscriptions.
   *
   */
  public destroyMsSubscriptions() {
    this.msSubscriptions.map((subscription) => {
      subscription.unsubscribe();
    });
    this.msSubscriptions = [];
  }

}
