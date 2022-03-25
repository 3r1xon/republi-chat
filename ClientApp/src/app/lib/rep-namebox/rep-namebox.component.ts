import {
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { UserStatus } from 'src/interfaces/account.interface';
import { Message } from 'src/interfaces/message.interface';
import { REPButton } from 'src/interfaces/repbutton.interface';


@Component({
  selector: 'rep-namebox',
  templateUrl: './rep-namebox.component.html',
  styleUrls: ['./rep-namebox.component.scss'],
})
export class REPNameBoxComponent {

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

}
