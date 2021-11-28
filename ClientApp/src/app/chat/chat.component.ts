import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessagesService } from 'src/services/messages.service';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  constructor(
    public _msService: MessagesService,
  ) { }

  ngOnInit(): void {
    this._msService.getMessages();
  }

  ngOnDestroy(): void {
  }

  deleteMessage(index: number) {
  } 

  openSelectedUser(event: any) {
    console.log(event);
  }

  editMessage(index: number) {
  }

}