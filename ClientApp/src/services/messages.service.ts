import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from 'src/interfaces/message.interface';
import { UserService } from './user.service';
import { database } from 'src/environments/database';
import { ServerResponse } from 'src/interfaces/response.interface';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(
    private _user: UserService,
    private sanitizer: DomSanitizer,
    private http: HttpClient) { }

  public messages: Array<Message> = [];

  public async getMessages() {
    const res = await this.http.get<ServerResponse>(`${database.BASE_URL}/messages/getMessages`).toPromise();

    if (res.success) {
      this.messages = [];

      res.data.forEach((msg: Message) => {
        this.messages.push({
          id: msg.id,
          userName: msg.userName,
          userMessage: msg.userMessage,
          date: new Date(msg.date),
          userImage: this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + msg.userImage),
          userColor: "#FFFFFF"
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

    const res = await this.http.post<ServerResponse>(`${database.BASE_URL}/messages/sendMessage`, msg).toPromise();

    if (res.success) {
      this.messages.push({
        id: res.data,
        userName: this._user.currentUser?.userName,
        userMessage: msg.userMessage,
        userColor: "#FFFFFF",
        userImage: this._user.currentUser.profilePicture,
        date: new Date(msg.date)
      });
    }
  }

  public async deleteMessage(index: number) {
    const res = await this.http.delete<ServerResponse>(`${database.BASE_URL}/messages/deleteMessage`, { 
      body: {
        id_message: this.messages[index].id
      } 
    }).toPromise();
    
    if (res.success) {
      this.messages.splice(index, 1);
    }
  }

}
