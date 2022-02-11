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
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Message } from 'src/interfaces/message.interface';
import { REPButton } from 'src/interfaces/repbutton.interface';


@Component({
  selector: 'rep-chat',
  templateUrl: './rep-chat.component.html',
  styleUrls: ['./rep-chat.component.scss']
})
export class REPChatComponent implements AfterViewInit, OnDestroy {

  ngAfterViewInit(): void {
    this.msg.changes.subscribe(() => {
      // console.log("scrollTop ---->", this.content.nativeElement.scrollTop);
      // console.log("width     ---->", this.content.nativeElement.scrollWidth);

      if (this.messages[this.messages?.length-1]?.auth) {
        this.scrollToBottom();

      } else if (this.messages.length > this.prevLength) {
        this.prevLength = this.messages.length;

        this.scrollToBottom();
      }
    });
  }

  ngOnDestroy(): void {
    this.msg.changes?.unsubscribe();
  }

  @ViewChild('content')
  private content: ElementRef;

  @ViewChildren('msg')
  private msg: any;

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

  @Input()
  public dateFormat: string = "dd/MM/yyyy";

  @Output()
  public sendMessage = new EventEmitter();

  private prevLength: number = 0;

  public selections: Array<Message> = [];

  public _chatOptions: Array<REPButton> = [];

  private readonly DEFAULT_OPTIONS: Array<REPButton> = [
    {
      name: "Search",
      icon: "search",
      tooltip: "Search a message",
      onClick: () => {

      }
    }
  ];

  @Input()
  public set chatOptions(options: Array<REPButton>) {
    options.unshift(...this.DEFAULT_OPTIONS);
    this._chatOptions = options;
  }

  public get chatOptions() {
    return this._chatOptions;
  }


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

      const exists = this.isInSelection(this.messages[index].id);

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
      for (let i = 0; i < this.messages.length; i++) {
        if (this.isInSelection(this.messages[i].id)) {
          if (this.messages[i-1] === undefined) return;
          this.selections.push(this.messages[i-1]);
          return;
        }
      }
    }
  }

  @HostListener('document:keydown.shift.arrowdown', ['$event'])
  selectDown() {
    if (this.selections.length > 0) {
      for (let i = this.messages.length-1; i > 0; i--) {
        if (this.isInSelection(this.messages[i].id)) {
          if (this.messages[i+1] === undefined) return;
          this.selections.push(this.messages[i+1]);
          return;
        }
      }
    }
  }


  isInSelection(id: number) {
    return this.selections.some(msg => msg.id === id);
  }


  spreadDate(date: Date, index: number) {

    const before = this.messages[index-1]?.date;

    const after = new Date(date);

    before?.setHours(0, 0, 0, 0);

    after?.setHours(0, 0, 0, 0);

    if (after > before)
      return true;

    return false;
  }
}