import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Message } from 'src/interfaces/message.interface';

@Component({
  selector: 'rep-chat',
  templateUrl: './rep-chat.component.html',
  styleUrls: ['./rep-chat.component.scss']
})
export class REPChatComponent implements OnInit, OnDestroy {

  constructor(
  ) { }

  @Input()
  public messages: Array<Message>;

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}