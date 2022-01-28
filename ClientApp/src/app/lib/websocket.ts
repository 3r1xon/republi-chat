import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

const socketOptions = {
  reconnection: true,
  reconnectionDelay: 2500,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 20,
  transports: ['websocket'],
  upgrade: false
};

export class WebSocket {

  constructor(connection: string, options = socketOptions) {
    this.socket = io(connection, options);

    // this.listen("connect")
    //   .subscribe(() => {
    //     this._utils.loading = false;
    //   });

    // this.listen("disconnect")
    //   .subscribe(() => {
    //     if (this._user.userAuth)
    //       this._utils.loading = true;
    //   });
  }

  public socket: Socket;

  public listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }

  public listenOnce(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.once(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }

  public emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }
}
