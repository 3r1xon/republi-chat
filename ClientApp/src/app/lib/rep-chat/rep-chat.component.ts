import { 
  AfterViewInit, 
  Component, 
  Input, 
  OnInit, 
  ViewChildren, 
  ViewChild, 
  ElementRef, 
  QueryList, 
  Output, 
  EventEmitter 
} from '@angular/core';
import { Account } from 'src/interfaces/account.interface';
import { Message } from 'src/interfaces/message.interface';

@Component({
  selector: 'rep-chat',
  templateUrl: './rep-chat.component.html',
  styleUrls: ['./rep-chat.component.scss']
})
export class REPChatComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit(): void {
    this._messages?.changes.subscribe(this.scrollToBottom);
  }

  @ViewChildren('messages') _messages: QueryList<any>;

  @ViewChild('content') content: ElementRef;

  @Input()
  public textboxEnabled: boolean = true;

  @Input()
  public messages: Array<Message>;

  @Input()
  public user: Account;

  @Output()
  public sendMessage = new EventEmitter();

  send(event) {
    this.sendMessage.emit(event);
  }

  ngAfterViewInit() {

  }
  
  scrollToBottom = () => {
    try {
      this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
    } catch (err) {}
  }
}