import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from 'src/interfaces/message.interface';
import { UserService } from './user.service';
import { server } from 'src/environments/server';
import { ServerResponse } from 'src/interfaces/response.interface';
import { FileUploadService } from './file-upload.service';
import { WebSocket } from '../app/lib/websocket';
import { Channel } from 'src/interfaces/channel.interface';
import { Subject, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { ChannelPermissions } from 'src/interfaces/channelPermissions.interface';
import { UtilsService } from './utils.service';


@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(
    private _user: UserService,
    private _fileUpload: FileUploadService,
    private _utils: UtilsService,
    private http: HttpClient
  ) {
  }

  public messages: Array<Message> = [];

  public messages$: Subject<any> = new Subject<any>();

  public channels: Array<Channel> = [];

  public channels$: Subject<any> = new Subject<any>();

  public currentRoom: Channel;

  public chPermissions: ChannelPermissions;

  private msSubscriptions: Array<Subscription> = [];

  private chSubscriptions: Array<Subscription> = [];

  private channelsIO: WebSocket = new WebSocket(server.WEB_SOCKET + "/channels");

  private messagesIO: WebSocket = new WebSocket(server.WEB_SOCKET + "/messages");

  /**
   * Get the current user channels.
   *
   */
  public getChannels() {
    this.http.get<ServerResponse>(`${server.BASE_URL}/channels/getChannels`)
      .pipe(first())
      .subscribe(
        (res: ServerResponse) => {
          if (res.success) {
            this.channels = res.data;

            this.destroyChSubscriptions();

            this.chSubscriptions
            .push(
              this.channelsIO.listen("ban")
                .subscribe((banID) => {
                  if (banID == this.chPermissions.id) {
                    this.messages = [];
                    // this.channels.find(channel => channel.)
                    this._utils.showRequest(
                      "Banned",
                      "You have been banned!"
                    );
                  }
                })
            );

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
  public joinChannel(room: Channel) {

    this.getChPermissions(room)
    .pipe(first())
    .subscribe(
      (channel) => {

        this.getChMessages(room, 50)
          .pipe(first())
          .subscribe(
            (res: ServerResponse) => {

              if (res.success) {

                this.currentRoom = room;

                this.chPermissions = <ChannelPermissions>channel.data;

                this.destroyMsSubscriptions();

                const mapMsg = (msg: Message) => {
                  msg.picture = this._fileUpload.sanitizeIMG(msg.picture);
                  msg.date = new Date(msg.date);
                  msg.auth = this.chPermissions.id === msg.author;
                  return msg;
                }

                this.messages = res.data?.map((msg: Message) => {
                  return mapMsg(msg);
                });

                this.messages$.next();

                this.messagesIO.emit("joinChannel", {
                  room: this.currentRoom._id,
                  userID: this._user.currentUser.id
                });

                this.msSubscriptions
                  .push(
                    this.messagesIO.listen("message")
                      .subscribe((message: string) => {
                        const msg = <Message>JSON.parse(message);
                        this.messages.push(mapMsg(msg));
                      })
                );

                this.msSubscriptions
                  .push(
                    this.messagesIO.listen("deleteMessage")
                      .subscribe((_id: number) => {
                        const index = this.messages.findIndex(msg => msg.id == _id);
                        this.messages.splice(index, 1);
                      })
                );


                this.msSubscriptions
                .push(
                  this.messagesIO.listen("connect")
                    .subscribe(() => {
                      const room = this.currentRoom;

                      if (this.currentRoom) {
                        this.currentRoom = undefined;

                        this.joinChannel(room);
                      }
                    })
                );

                this.msSubscriptions
                .push(
                  this.messagesIO.listen("disconnect")
                    .subscribe(() => {
                    })
                );
              }
            }
          );
      }
    );
  }

  public getChMessages(room: Channel, limit: number) {
    return this.http.get<ServerResponse>(`${server.BASE_URL}/messages/getChannelMessages/${room._id}/${limit}`);
  }

  public getChPermissions(room: Channel) {
    return this.http.get<ServerResponse>(`${server.BASE_URL}/messages/getChannelPermissions/${room._id}`);
  }

  public leaveChannel(room: number) {

  }

  /**
   * Sends a message in the current room.
   *
   * @param message The string that contains the message.
   */
  public sendMessage(message: string) {
    this.messagesIO.emit("message", message);
  }

  /**
   * Delete message on the current room.
   *
   * @param _id The message ID you want to remove.
   */
  public deleteMessage(_id: number) {
    this.messagesIO.emit("deleteMessage", _id);
  }

  /**
   * Ban a user in the current channel on a channel.
   *
   * @param room The ID of the channel.
   * 
   * @param _id The ID of the user you want to ban.
   */
  public banUser(room: Channel, _id: number) {
    this.messagesIO.emit("ban", {
      room: room._id,
      _id: _id
    });
  }

  /**
   * Ban a user in the current channel on a channel.
   *
   * @param room The ID of the channel.
   * 
   * @param _id The ID of the user you want to kick.
   */
   public kickUser(room: Channel, _id: number) {
    this.messagesIO.emit("kick", {
      room: room._id,
      _id: _id
    });
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

  /**
   * Destroys the channel subscriptions.
   *
   */
  public destroyChSubscriptions() {
    this.chSubscriptions.map((subscription) => {
      subscription.unsubscribe();
    });
    this.chSubscriptions = [];
  }

}
