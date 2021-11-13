import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessagesService } from 'src/services/messages.service';

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
    this._msService.getMessages();
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