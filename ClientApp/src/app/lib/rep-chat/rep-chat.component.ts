import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewChildren
} from '@angular/core';
import { Message } from 'src/interfaces/message.interface';
import { REPButton } from 'src/interfaces/repbutton.interface';

@Component({
  selector: 'rep-chat',
  templateUrl: './rep-chat.component.html',
  styleUrls: ['./rep-chat.component.scss']
})
export class REPChatComponent implements AfterViewInit {

  constructor() { }

  ngAfterViewInit(): void {
    this.msg.changes.subscribe(() => {
      if (this.messages[this.messages?.length-1]?.auth)
        this.scrollToBottom();
    });
  }

  @ViewChild('content') content: ElementRef;

  @ViewChildren('msg') msg: any;

  @Input()
  public textboxEnabled: boolean = true;

  @Input()
  public messages: Array<Message>;

  @Input()
  public msOptions: Array<REPButton>;

  @Output()
  public sendMessage = new EventEmitter();

  send(event) {
    this.sendMessage.emit(event);
  }

  scrollToBottom = () => {
    try {
      this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
    } catch{ }
  }
}