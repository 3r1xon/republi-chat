import { AfterViewInit, Component, Input, OnInit, ViewChildren, ViewChild, ElementRef, QueryList } from '@angular/core';
import { Message } from 'src/interfaces/message.interface';

@Component({
  selector: 'rep-chat',
  templateUrl: './rep-chat.component.html',
  styleUrls: ['./rep-chat.component.scss']
})
export class REPChatComponent implements OnInit, AfterViewInit {

  constructor(
  ) { }

  @ViewChildren('messages') _messages: QueryList<any>;
  @ViewChild('content') content: ElementRef;

  @Input()
  public messages: Array<Message>;

  ngOnInit(): void {
    this._messages?.changes.subscribe(this.scrollToBottom);
  }

  ngAfterViewInit() {

  }

  
  scrollToBottom = () => {
    try {
      this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
    } catch (err) {}
  }
}