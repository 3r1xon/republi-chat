import {
  Component,
  Input,
  Output,
  EventEmitter,
  Renderer2,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { UserStatus } from 'src/interfaces/account.interface';
import { Message } from 'src/interfaces/message.interface';
import { REPButton } from 'src/interfaces/repbutton.interface';


@Component({
  selector: 'rep-namebox',
  templateUrl: './rep-namebox.component.html',
  styleUrls: ['./rep-namebox.component.scss'],
})
export class REPNameBoxComponent implements AfterViewInit {

  constructor(
    private renderer: Renderer2
  ) { }

  ngAfterViewInit(): void {
    this.msgHTMLParser();
  }

  @ViewChild('content') content: ElementRef;

  @Input()
  public options: Array<REPButton>;

  @Input()
  public message: Message;

  @Input()
  public dateFormat: string = "dd/MM/yyyy HH:mm";

  @Input()
  public uniqueID: number;

  @Input()
  public highlighted: boolean = false;

  @Input()
  public hold: boolean = false;

  @Input()
  public backgroundColor: string;

  @Input()
  public status: UserStatus;

  @Output()
  public onUserClick = new EventEmitter<string>();

  @Output()
  public onClick = new EventEmitter();

  public active: boolean = false;

  public pictureError: boolean = false;

  clickHandler() {
    this.onClick.emit();
  }

  msgHTMLParser(): void {
    let msg = this.message.message ??= "";

    const words = msg.split(" ");

    words.forEach((word) => {

      const URL_REG = /(https?:\/\/[^\s]+)/g;

      if (word.match(URL_REG)) {
        const a = this.renderer.createElement('a');

        a.innerText = " " + word;
        a.href = word;
        a.target = "_blank";

        this.renderer.appendChild(this.content.nativeElement, a);

        return;
      }

      const d = this.renderer.createElement('d');
      d.innerText = " " + word;

      this.renderer.appendChild(this.content.nativeElement, d);
    });
  }

}
