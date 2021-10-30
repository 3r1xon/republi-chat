import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessagesService } from 'src/services/messages.service';
import { database } from 'src/environments/database';
import { ServerResponse } from 'src/interfaces/response.interface';
import { format, parseISO } from 'date-fns';

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

    this.http.post<ServerResponse>(`${database.BASE_URL}/getMessages`, {}).subscribe((res: ServerResponse) => {
      if (res.success) {
        this._msService.messages = [];
        res.data.forEach((msg: any) => {
          this._msService.messages.push({
            id: msg.ID_MESSAGE,
            userName: msg.NICKNAME,
            userMessage: msg.MESSAGE,
            date: parseISO(msg.DATE)
          });
        });
      }
    });
  }

}
