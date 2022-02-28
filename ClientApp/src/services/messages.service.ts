import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from 'src/interfaces/message.interface';
import { UserService } from './user.service';
import { server } from 'src/environments/server';
import { ServerResponse } from 'src/interfaces/response.interface';
import { FileUploadService } from './file-upload.service';
import { Channel } from 'src/interfaces/channel.interface';
import { Room } from 'src/interfaces/room.interface';
import { Subject, Subscription } from 'rxjs';
import { ChannelPermissions } from 'src/interfaces/channelPermissions.interface';
import { UtilsService } from './utils.service';
import { WebSocketService } from './websocket.service';


@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(
    private _user: UserService,
    private _fileUpload: FileUploadService,
    private _utils: UtilsService,
    private _webSocket: WebSocketService,
    private http: HttpClient
  ) { }

  public messages: Array<Message> = [];

  public messages$: Subject<any> = new Subject<any>();

  public channels: Array<Channel> = [];

  public channels$: Subject<any> = new Subject<any>();

  public currentChannel: Channel;

  public currentRoom: Room;

  public chPermissions: ChannelPermissions;

  private msSubscriptions: Array<Subscription> = [];

  private chSubscriptions: Array<Subscription> = [];

  /**
   * Get the current user channels.
   *
   */
  public getChannels() {
    this.API_getChannels()
    .toPromise()
    .then(
      (res: ServerResponse) => {
        if (res.success) {
          this.channels = res.data;
          console.log(this.channels)

          this.destroyChSubscriptions();

          this.chSubscriptions
          .push(
            this._webSocket.listen("ban")
              .subscribe((banID) => {
                if (banID == this.chPermissions.id) {
                  this.messages = [];

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
    ).catch(() => { });
  }

  /**
   * Get the current room messages and initializes all sockets.
   *
   * @param channel The channel object you want to join into.
   *
   */
  public joinChannel(channel: Channel) {

    this.API_getChPermissions(channel)
    .toPromise()
    .then(
      (resChannel: ServerResponse) => {

        this.currentChannel = channel;

        this.chPermissions = resChannel.data as ChannelPermissions;

        this.API_getChRooms(channel)
          .toPromise()
          .then((res: ServerResponse) => {

            this.currentChannel.rooms = res.data;

            if (this.currentChannel.rooms.text.length > 0)
              this.listRoomMessages(channel, this.currentChannel.rooms.text[0]);
          });
      }
    ).catch(() => { 
      this._utils.showBugReport("Server error!", "There has been an error while requesting the channels!", false);
    });
  }

  public listRoomMessages(channel: Channel, room: Room) {

    this.API_getRoomMessages(channel, room, 50)
    .toPromise()
    .then(
      (res: ServerResponse) => {

        if (res.success) {

          this.currentRoom = room;

          this.destroyMsSubscriptions();

          const mapMsg = (msg: Message) => {
            msg.picture = this._fileUpload.sanitizeIMG(msg.picture);
            msg.date = new Date(msg.date);
            msg.auth = this.chPermissions.id === msg.author;
            return msg;
          };

          this.messages = res.data?.map((msg: Message) => {
            return mapMsg(msg);
          });

          this.messages$.next();

          this._webSocket.emit("joinRoom", {
            channel: channel._id,
            room: room.roomID,
            userID: this._user.currentUser.id
          });

          // Initializes all sockets
          this.msSubscriptions
          .push(
            this._webSocket.listen("message")
              .subscribe((message: string) => {
                const msg = JSON.parse(message) as Message;
                this.messages.push(mapMsg(msg));
              })
          );

          this.msSubscriptions
          .push(
            this._webSocket.listen("deleteMessage")
              .subscribe((_id: number) => {
                const index = this.messages.findIndex(msg => msg.id == _id);
                this.messages.splice(index, 1);
              })
          );

          this.msSubscriptions
          .push(
            this._webSocket.listen("connect")
              .subscribe(() => {
                const channel = this.currentChannel;

                if (this.currentRoom) {
                  this.currentRoom = undefined;

                  this.joinChannel(channel);
                }
              })
          );

          this.msSubscriptions
          .push(
            this._webSocket.listen("disconnect")
              .subscribe(() => {
              })
          );
        }
      }
    ).catch(() => {
      this._utils.showBugReport("Server error!", "There has been an error while requesting the messages!", false);
    });

  }

  public API_getChannels() {
    return this.http.get<ServerResponse>(`${server.BASE_URL}/channels/getChannels`);
  }

  public API_getRoomMessages(channel: Channel, room: Room, limit: number = 50) {
    return this.http.get<ServerResponse>(`${server.BASE_URL}/messages/getRoomMessages/${channel._id}/${room.roomID}/${limit}`);
  }

  public API_getChRooms(channel: Channel) {
    return this.http.get<ServerResponse>(`${server.BASE_URL}/channels/getChannelRooms/${channel._id}`);
  }

  public API_getChPermissions(channel: Channel) {
    return this.http.get<ServerResponse>(`${server.BASE_URL}/messages/getChannelPermissions/${channel._id}`);
  }

  public leaveChannel(room: number) {

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
   * Ban a user in the current channel on a channel.
   *
   * @param room The ID of the channel.
   * 
   * @param _id The ID of the user you want to ban.
   */
  public banUser(room: Channel, _id: number) {
    this._webSocket.emit("ban", {
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
    this._webSocket.emit("kick", {
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
  public API_createChannel(channel: Channel) {
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
  public API_addChannel(channel: Channel) {
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
