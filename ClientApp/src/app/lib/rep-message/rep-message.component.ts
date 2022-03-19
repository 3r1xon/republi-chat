import {
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Message } from 'src/interfaces/message.interface';
import { REPButton } from 'src/interfaces/repbutton.interface';


@Component({
  selector: 'rep-message',
  templateUrl: './rep-message.component.html',
  styleUrls: ['./rep-message.component.scss']
})
export class REPMessageComponent {

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

  @Output()
  public onUserClick = new EventEmitter<string>();

  @Output()
  public onClick = new EventEmitter();

  public active: boolean = false;

  public pictureError: boolean = false;

  clickHandler() {
    this.onClick.emit();
  }

}
