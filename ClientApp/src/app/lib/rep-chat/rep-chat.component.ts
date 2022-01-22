import { 
  Component, 
  Input, 
  ViewChild, 
  ElementRef, 
  Output, 
  EventEmitter, 
  AfterViewChecked
} from '@angular/core';
import { Message } from 'src/interfaces/message.interface';
import { REPButton } from 'src/interfaces/repbutton.interface';

@Component({
  selector: 'rep-chat',
  templateUrl: './rep-chat.component.html',
  styleUrls: ['./rep-chat.component.scss']
})
export class REPChatComponent implements AfterViewChecked {

  constructor() { }

  ngAfterViewChecked() {        
    this.scrollToBottom();        
  } 

  @ViewChild('content') content: ElementRef;

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
    this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
  }
}