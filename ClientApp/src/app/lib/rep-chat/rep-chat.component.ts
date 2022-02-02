import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewChildren,
  HostListener,
} from '@angular/core';
import { Message } from 'src/interfaces/message.interface';
import { REPButton } from 'src/interfaces/repbutton.interface';


@Component({
  selector: 'rep-chat',
  templateUrl: './rep-chat.component.html',
  styleUrls: ['./rep-chat.component.scss']
})
export class REPChatComponent implements AfterViewInit {

  constructor(
  ) { 
  }

  ngAfterViewInit(): void {
    this.msg.changes.subscribe(() => {
      // console.log("scrollTop ---->", this.content.nativeElement.scrollTop);
      // console.log("width ----> ", this.content.nativeElement.scrollWidth);
      if (!this.initialized) {
        this.scrollToBottom();
        this.initialized = true;
      }

      if (this.messages[this.messages?.length-1]?.auth) {
        this.scrollToBottom();

      } else if (this.messages.length > this.prevLength) {
        this.prevLength = this.messages.length;

        this.scrollToBottom();
      }
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

  @Input()
  public msgMaxLength: number = 2000;

  @Input()
  public chatName: string;

  @Output()
  public sendMessage = new EventEmitter();

  private initialized: boolean = false;

  private prevLength: number = 0;

  public selections: Array<Message> = [];

  @Input()
  public readonly chatOptions: Array<REPButton> = [];

  send(event) {
    this.sendMessage.emit(event);
  }

  scrollToBottom() {
    try {
      this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
    } catch{ }
  }

  deselectAll() {
    this.selections = [];
  }

  select(index: number, event: KeyboardEvent) {
    const ctrlKey = event.ctrlKey;

    if (ctrlKey) {

      const exists = this.selections.some(msg => msg.id === this.messages[index].id);

      if (exists) {
        this.selections = this.selections.filter(msg => msg.id !== this.messages[index].id);

        return;
      }

      this.selections.push(
        this.messages[index]
      );
    } else {
      this.deselectAll();
    }
  }

  @HostListener('document:keydown.shift.arrowup', ['$event']) 
  selectUp() {
    if (this.selections.length > 0) {
    }
  }

  @HostListener('document:keydown.shift.arrowdown', ['$event']) 
  selectDown() {
    if (this.selections.length > 0) {
    }
  }


  isInSelection(id: number) {
    return this.selections.some(msg => msg.id === id);
  }
}