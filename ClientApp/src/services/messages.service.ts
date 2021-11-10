import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from 'src/interfaces/message.interface';
import { UserService } from './user.service';
import { database } from 'src/environments/database';
import { ServerResponse } from 'src/interfaces/response.interface';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(
    private _user: UserService, 
    private http: HttpClient) { }

  public messages: Array<Message> = [];

  public sendMessage(message: string) {
    console.log(this._user.currentUser)
    const msg = {
      id: this._user.currentUser?.ID_USER,
      userMessage: message,
      date: new Date()
    };

    this.http.post<ServerResponse>(`${database.BASE_URL}/sendMessage`, msg).subscribe((res: ServerResponse) => {
      if (res.success) {
        this.messages.push({
          id: res.data,
          userMessage: msg.userMessage,
          userName: this._user.currentUser?.NICKNAME ?? '',
          date: msg.date
        });
      }
    });
  }

  public deleteMessage(index: number) {

    this.http.post<ServerResponse>(`${database.BASE_URL}/deleteMessage`, { 
      id_message: this.messages[index].id 
    }).subscribe((res: ServerResponse) => {
      if (res.success) {
        this.messages.splice(index, 1);
      }
    });
  }

}
