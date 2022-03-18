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
  OnDestroy,
} from '@angular/core';
import { Message } from 'src/interfaces/message.interface';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { REPTextBoxComponent } from '../rep-textbox/rep-textbox.component';


@Component({
  selector: 'rep-chat',
  templateUrl: './rep-chat.component.html',
  styleUrls: ['./rep-chat.component.scss']
})
export class REPChatComponent implements AfterViewInit, OnDestroy {

  constructor(
    private eRef: ElementRef
  ) { }

  ngAfterViewInit(): void {
    this.msg.changes.subscribe(() => {

      if (!this.initialized) {
        this.scrollToBottom();
        this.initialized = true;
      }

      // const scrollTop = this.content.nativeElement.scrollTop;
      // const scrollWidth = this.content.nativeElement.scrollWidth;

      // if (this.messages[this.messages?.length-1]?.auth) {
      //   this.scrollToBottom();
      // }

      this.scrollToBottom();

    });
  }

  ngOnDestroy(): void {
    this.msg.changes?.unsubscribe();
  }

  private initialized: boolean = false;

  @ViewChild('content')
  private content: ElementRef;

  @ViewChildren('msg')
  private msg: any;

  @ViewChild(REPTextBoxComponent)
  private textbox: REPTextBoxComponent;

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
  public unread: number;

  private _dateFormat: string = "dd/MM/yyyy";

  @Input()
  public set dateFormat(format: string) {
    this._dateFormat = format.replace(":ss", "");
  };

  public get dateFormat() {
    return this._dateFormat;
  }

  @Output()
  public sendMessage = new EventEmitter();

  public selections: Array<Message> = [];

  private _chatOptions: Array<REPButton> = [];

  private readonly DEFAULT_OPTIONS: Array<REPButton> = [
    {
      name: "Search",
      icon: "search",
      tooltip: "Search a message",
      enabled: () => this.messages.length > 0,
      onClick: () => {

      }
    },
    {
      name: "Align",
      icon: "vertical_align_bottom",
      tooltip: "Scroll to bottom",
      enabled: () => this.messages.length > 0,
      onClick: () => {
        this.scrollToBottom();
      }
    },
  ];

  @Input()
  public set chatOptions(options: Array<REPButton>) {
    options.unshift(...this.DEFAULT_OPTIONS);
    this._chatOptions = options;
  }

  public get chatOptions() {
    return this._chatOptions;
  }


  send(event): void {
    this.sendMessage.emit(event);
  }

  reset(): void {
    this.initialized = false;
    this.unread = null;
    this.deselectAll();
  }

  scrollToBottom(): void {
    this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
  }

  deselectAll(): void {
    this.selections = [];
  }

  select(index: number, event: KeyboardEvent, surpassCtrl: boolean = false): void {
    const ctrlKey = event.ctrlKey;

    if (ctrlKey || surpassCtrl) {

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
  selectUp(): void {
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
  selectDown(): void {
    if (this.selections.length > 0) {
      for (let i = this.messages.length-1; i >= 0; i--) {
        if (this.isInSelection(this.messages[i].id)) {
          if (this.messages[i+1] === undefined) return;
          this.selections.push(this.messages[i+1]);
          return;
        }
      }
    }
  }

  @HostListener('document:click', ['$event'])
  clickout(event): void {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.deselectAll();
    }
  }


  isInSelection(id: number): boolean {
    return this.selections.some(msg => msg.id === id);
  }

  spreadDate(date: Date, index: number): boolean {

    if (index == 0) return true;

    const before = new Date(this.messages[index-1]?.date);

    const after = new Date(date);

    before?.setHours(0, 0, 0, 0);

    after?.setHours(0, 0, 0, 0);

    if (after > before)
      return true;

    return false;
  }

  getText() {
    return this.textbox.form.value["text"];
  }

  setText(text: string) {
    this.textbox.setTextValue(text);
  }
}
