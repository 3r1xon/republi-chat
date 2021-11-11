import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessagesService } from 'src/services/messages.service';
import { database } from 'src/environments/database';
import { ServerResponse } from 'src/interfaces/response.interface';
import { parseISO } from 'date-fns';
import { Message } from 'src/interfaces/message.interface';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  constructor(
    public _msService: MessagesService, 
    private http: HttpClient) { }

  ngOnInit(): void {
    this.getMessages();
  }

  getMessages() {

    this.http.get<ServerResponse>(`${database.BASE_URL}/getMessages`).subscribe((res: ServerResponse) => {
      if (res.success) {
        this._msService.messages = [];

        res.data.forEach((msg: Message) => {
          this._msService.messages.push({
            id: msg.id,
            userName: msg.userName,
            userMessage: msg.userMessage,
            date: new Date(msg.date),
            userImage: "",
            userColor: "#FFFFFF"
          });
        });
      }
    });
  }

  deleteMessage(index: number) {
    this._msService.deleteMessage(index);
  } 

  openSelectedUser(event: any) {
    console.log(event);
  }

  editMessage(index: number) {

  }

}
