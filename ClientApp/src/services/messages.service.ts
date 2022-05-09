import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Message } from 'src/interfaces/message.interface';
import { UserService } from './user.service';
import { ServerResponse } from 'src/interfaces/response.interface';
import { Channel, Room } from 'src/interfaces/channel.interface';
import { Subscription } from 'rxjs';
import { ChannelPermissions, RoomPermissions } from 'src/interfaces/channel.interface';
import { UtilsService } from './utils.service';
import { WebSocketService } from './websocket.service';
import { environment } from 'src/environments/environment';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { DOCUMENT } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(
    private _user: UserService,
    private _utils: UtilsService,
    private _webSocket: WebSocketService,
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document
  ) { }

  public messages: Array<Message> = [];

  public channels: Array<Channel> = [];

  public currentChannel: Channel;

  public currentRoom: Room;

  public currentVocalRoom: Room;

  public chPermissions: ChannelPermissions;

  public roomPermissions: RoomPermissions;

  private msSubscriptions: Array<Subscription> = [];

  private chSubscriptions: Array<Subscription> = [];

  private vocalSubscriptions: Array<Subscription> = [];

  private channelsSubscriptions: Array<Subscription> = [];

  /**
   * Get the current user channels.
   *
   */
  public async getChannels() {

    await this.API_getChannels()
      .toPromise()
      .then(
        (res: ServerResponse) => {
          if (res.success) {

            this.channels = res.data;

            this.initChannelsSockets();
          }
        }
      ).catch(() => {

        this._utils.showBugReport(
          "Server error!",
          "There has been an error while fetching the channels!"
        );
      });
  }

  /**
   * Get the current room messages and initializes all sockets.
   *
   * @param channel The channel object you want to join into.
   *
   */
  public async joinChannel(channel: Channel) {

    await this.API_getChannelInfo(channel)
      .toPromise()
      .then(async (resChannel: ServerResponse) => {

        this.currentChannel = channel;

        this.chPermissions = resChannel.data.permissions as ChannelPermissions;

        this.currentChannel.pendings = resChannel.data.pendings;

        this.initChannelSockets();

        this.currentChannel.rooms = resChannel.data.rooms;

        const lastJoinedRoom = this.getRoomByID(this._user.currentUser.lastJoinedRoom);

        if (lastJoinedRoom) {
          await this.joinRoom(channel, lastJoinedRoom);

        } else if (this.currentChannel.rooms.length > 0) {

          const room = this.currentChannel.rooms
            .find(room => room.textRoom == true);

          await this.joinRoom(channel, room);
        }

      })
      .catch(() => {

        this._utils.showBugReport(
          "Server error!",
          "There has been an error while joining the channel!"
        );
      });
  }



  public async joinRoom(channel: Channel, room: Room) {

    if (room.textRoom) {

      await this.API_getChRoomInfo(channel, room)
        .toPromise()
        .then(async (resRoom: ServerResponse) => {

          this.currentRoom = room;

          this.roomPermissions = resRoom.data.permissions as RoomPermissions;

          this.currentRoom.members = resRoom.data.members;

          room.notifications = 0;

          await this.API_getRoomMessages(channel, room, 50)
            .toPromise()
            .then((res: ServerResponse) => {

              if (res.success) {

                this.messages = res.data?.map((msg: Message) => {
                  return this.mapMsg(msg);
                });

                this.initTextRoomSockets();
              }
            })
            .catch(() => {

              this._utils.showBugReport(
                "Server error!",
                "There has been an error while requesting the messages!"
              );
            });
        });
    } else {
      // TODO:
      // Join a vocal room
      this.currentVocalRoom = room;

      this.currentVocalRoom.connected ??= [];

      this.currentVocalRoom.connected.push(this._user.currentUser);

      this.initVocalRoomSockets();
    }
  }



  public mapMsg(msg: Message): Message {
    msg.date = msg.date ? new Date(msg.date) : null;
    msg.auth = this.chPermissions.id === msg.author;
    return msg;
  }



  public isInChannel(channel: Channel): boolean {
    return this.currentChannel.id == channel.id;
  }



  public isInRoom(room: Room): boolean {
    return room.roomID == this.currentRoom?.roomID || room.roomID == this.currentVocalRoom?.roomID;
  }



  private initVocalRoomSockets(): void {

    this.destroyVocalSubscriptions();

    const channel = this.currentChannel;

    const room = this.currentRoom;

    this._webSocket.emit("joinVocalRoom", {
      channel: channel.id,
      room: room.roomID
    });

    this.vocalSubscriptions
    .push(
      this._webSocket.listen("voice")
        .subscribe((audio: ArrayBuffer) => {


        })
    );


    // WORK IN PROGRESS
    this.document.defaultView.navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {

        // const audioContext = new AudioContext();

        // const gain_node = audioContext.createGain();
        // gain_node.connect( audioContext.destination );

        // const microphone_stream = audioContext.createMediaStreamSource(stream);
        // // microphone_stream.connect(gain_node);

        // const script_processor_fft_node = audioContext.createScriptProcessor(2048, 1, 1);
        // script_processor_fft_node.connect(gain_node);

        // const BUFF_SIZE = 16384;

        // const analyserNode = audioContext.createAnalyser();
        // analyserNode.smoothingTimeConstant = 0;
        // analyserNode.fftSize = 2048;

        // const script_processor_node = audioContext.createScriptProcessor(BUFF_SIZE, 1, 1);

        // microphone_stream.connect(script_processor_node);

        // script_processor_fft_node.onaudioprocess = () => {

        //   const audioBuffer = new Uint8Array(analyserNode.frequencyBinCount);
        //   analyserNode.getByteFrequencyData(audioBuffer);

        //   this._webSocket.emit("voice", audioBuffer);

        // };

      });


  }



  private initTextRoomSockets(): void {

    this.destroyMsSubscriptions();

    const channel = this.currentChannel;

    const room = this.currentRoom;

    this._webSocket.emit("joinTextRoom", {
      channel: channel.id,
      room: room.roomID
    });

    // Initializes all sockets
    this.msSubscriptions
    .push(
      this._webSocket.listen("message")
        .subscribe((message: string) => {
          const msg = JSON.parse(message) as Message;
          this.messages.push(this.mapMsg(msg));
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
      this._webSocket.listen("highlightMessage")
        .subscribe((obj: string) => {

          const state: { msgID: number, state: boolean } = JSON.parse(obj);

          const msg = this.messages.find(msg => msg.id == state.msgID);

          if (msg) {
            msg.highlighted = state.state;
          }
        })
    );

    this.msSubscriptions
    .push(
      this._webSocket.listen("connect")
        .subscribe(async () => {
          const channel = this.currentChannel;

          if (this.currentRoom) {
            this.currentRoom = null;

            await this.joinChannel(channel);
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



  private initChannelSockets(): void {

    this.destroyChSubscriptions();

    this.chSubscriptions
      .push(
        this._webSocket.listen("channel")
          .subscribe(async (obj: any) => {

            switch(obj.emitType) {

              case "ROOM_NOTIFICATION": {
                const notification = obj;

                if (notification.room != this.currentRoom.roomID) {

                  const ref = this.getRoomByID(notification.room);

                  if (ref) {

                    ref.notifications ??= 0;

                    if (notification.type == "+") {
                      ref.notifications++;
                    } else {
                      if (ref.notifications - 1 >= 0) {
                        ref.notifications--;
                      }
                    }
                  }

                }
              } break;

              case "NEW_ROOM": {

                this.currentChannel.rooms.push(obj);

              } break;

              case "DELETE_ROOM": {

                const index = this.currentChannel.rooms
                  .findIndex(room => room.roomID == obj.roomID);

                const room = this.currentChannel.rooms[index];

                if (room) {

                  if (this.isInRoom(room) && this.currentChannel.rooms[0])
                    await this.joinRoom(this.currentChannel, this.currentChannel.rooms[0]);

                  this.currentChannel.rooms.splice(index, 1);
                }

              } break;

              case "ROOM_ORDER": {

                if (obj.emitter != this._user.currentUser.id) {

                  moveItemInArray(
                    this.currentChannel.rooms,
                    obj.previousIndex,
                    obj.currentIndex,
                  );

                }

              } break;

              case "BAN_MEMBER": {

                if (obj.userID == this._user.currentUser.id) {

                  this._utils.showRequest(
                    "Banned",
                    `You have been banned from this channel.`
                  );

                  const index = this.channels.findIndex(ch => ch.id == this.currentChannel.id);

                  if (index != -1) {
                    this.channels.splice(index, 1);

                    this.leaveChannel();
                  }

                }

              } break;

            }

          })
      );

    this.chSubscriptions
        .push(
          this._webSocket.listen("members")
            .subscribe((obj: any) => {

              switch(obj.emitType) {

                case "MEMBER_STATUS": {

                  const mrmbRef = this.currentRoom.members
                    .find(mrmb => mrmb.id == obj.userID);

                  if (mrmbRef) {
                    mrmbRef.userStatus = obj.status;
                  }

                } break;

                case "NEW_MEMBER": {

                  if (this.currentRoom.autoJoin) {
                    this.currentRoom.members.push(obj);
                  }

                } break;
              }

            })
        );

    this.chSubscriptions
    .push(
      this._webSocket.listen("pendings")
        .subscribe((obj: any) => {

          this.currentChannel.pendings.push(obj);
        })
    );
  }



  private initChannelsSockets(): void {

    this.destroyChannelsSubscriptions();

    this.channelsSubscriptions
      .push(
        this._webSocket.listen("channels")
          .subscribe((obj: any) => {

            switch(obj.emitType) {

              case "NEW_CHANNEL": {

                this.channels.push(obj);

                this._utils.showRequest(
                  "New channel added",
                  `Personnel of channel ${obj.name} have accepted you. The channel is now in your list.`
                );

              } break;

              case "LEAVE_CHANNEL": {

                const i = this.channels.findIndex(ch => ch.id == obj.channelID);

                if (this.channels[i]) {

                  const channel = this.channels[i];

                  this.channels.splice(i, 1);

                  if (channel.id == this.currentChannel.id)
                    this.leaveChannel();

                }

              } break;

            }

          })
      );

  }



  public getChannelByID(channelID: number): Channel {
    return this.channels.find(ch => ch.id == channelID);
  }



  public getRoomByID(roomID: number): Room {
    return this.currentChannel.rooms.find(room => room.roomID == roomID);
  }



  public async leaveChannel() {
    this.destroyMsSubscriptions();
    this.destroyChSubscriptions();
    this.messages = [];
    this.currentChannel = null;
    this.currentRoom = null;

    if (this.channels.length > 0) {
      await this.joinChannel(this.channels[0]);
    }
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
    this._webSocket.emit("banUser", _id);
  }

  /**
   * Kick a user in the current channel on a channel.
   *
   * @param room The ID of the channel.
   *
   * @param _id The ID of the user you want to kick.
   */
   public kickUser(room: Channel, _id: number) {
    this._webSocket.emit("kick", {
      room: room.id,
      _id: _id
    });
  }

  /**
   * Hightlight a message on the current room.
   *
   * @param _id The message ID you want to highlight.
   */
  public highlightMessage(_id: number) {
    this._webSocket.emit("highlightMessage", _id);
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
    const fd = new FormData();
    fd.append("name", channel.name);

    if (channel.picture instanceof File)
      fd.append("image", channel.picture, channel.picture?.name);

    return this.http.post<ServerResponse>(`${environment.BASE_URL}/channels/createChannel`, fd);
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
    return this.http.post<ServerResponse>(`${environment.BASE_URL}/channels/addChannel`, channel);
  }

  public API_leaveChannel(channel: Channel) {
    return this.http.put<ServerResponse>(`${environment.BASE_URL}/channels/leaveChannel`, {
      chID: channel.id
    });
  }

  public API_deleteRoom(channel: Channel, room: Room) {
    return this.http.delete<ServerResponse>(`${environment.BASE_URL}/channels/deleteRoom/${channel.id}/${room.roomID}`);
  }

  public API_getChannels() {
    return this.http.get<ServerResponse>(`${environment.BASE_URL}/channels/getChannels`);
  }

  public API_getRoomMessages(channel: Channel, room: Room, limit: number = 50) {
    return this.http.get<ServerResponse>(`${environment.BASE_URL}/channels/getRoomMessages/${channel.id}/${room.roomID}/${limit}`);
  }

  public API_getChannelInfo(channel: Channel) {
    return this.http.get<ServerResponse>(`${environment.BASE_URL}/channels/getChannelInfo/${channel.id}`);
  }

  public API_getChannelMembers(channel: Channel) {
    return this.http.get<ServerResponse>(`${environment.BASE_URL}/channels/getChannelMembers/${channel.id}`);
  }

  public API_getChRoomInfo(channel: Channel, room: Room) {
    return this.http.get<ServerResponse>(`${environment.BASE_URL}/channels/getChRoomInfo/${channel.id}/${room.roomID}`);
  }

  public API_changePendingStatus(channel: Channel, userID: number, status: boolean) {
    return this.http.put<ServerResponse>(`${environment.BASE_URL}/channels/changePendingStatus`, {
      chID: channel.id,
      pendingID: userID,
      status: status
    });
  }

  public API_changeChOrder(previousChannel: Channel, currentChannel: Channel, previousIndex: number, currentIndex: number) {
    return this.http.put<ServerResponse>(`${environment.BASE_URL}/channels/changeChOrder`, {
      previousChannel: previousChannel.id,
      currentChannel: currentChannel.id,
      previousIndex: previousIndex,
      currentIndex: currentIndex
    });
  }

  public API_changeRoomsOrder(channel: Channel, previousRoom: Room, currentRoom: Room, previousIndex: number, currentIndex: number) {
    return this.http.put<ServerResponse>(`${environment.BASE_URL}/channels/changeRoomsOrder`, {
      chID: channel.id,
      previousRoom: previousRoom.roomID,
      currentRoom: currentRoom.roomID,
      previousIndex: previousIndex,
      currentIndex: currentIndex
    });
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

  public destroyChannelsSubscriptions() {
    this.channelsSubscriptions.map((subscription) => {
      subscription.unsubscribe();
    });
    this.channelsSubscriptions = [];
  }

  public destroyVocalSubscriptions() {
    this.vocalSubscriptions.map((subscription) => {
      subscription.unsubscribe();
    });
    this.vocalSubscriptions = [];
  }

}
