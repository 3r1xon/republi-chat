import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef
} from '@angular/core';
import { Message } from 'src/interfaces/message.interface';
import { REPButton } from 'src/interfaces/repbutton.interface';

@Component({
  selector: 'rep-message',
  templateUrl: './rep-message.component.html',
  styleUrls: ['./rep-message.component.scss']
})
export class REPMessageComponent {

  constructor(
    private eRef: ElementRef
  ) {
  }

  public active: boolean = false;

  public pictureError: boolean = false;

  @Input()
  public options: Array<REPButton>;

  @Input()
  public message: Message;

  @Input()
  public dateFormat: string = "dd/MM/yyyy HH:mm";

  @Input()
  public uniqueID: number;

  @Output()
  public onUserClick = new EventEmitter<string>();

  @Output()
  public onClick = new EventEmitter();

  clickHandler() {
    this.onClick.emit();
  }

  setToggle(event) {
    this.active = event;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.active = false;
    }
  }

}
