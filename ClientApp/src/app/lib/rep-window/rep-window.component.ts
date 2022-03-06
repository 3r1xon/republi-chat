import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { REPButton } from 'src/interfaces/repbutton.interface';

@Component({
  selector: 'rep-window',
  templateUrl: './rep-window.component.html',
  styleUrls: ['./rep-window.component.scss']
})
export class REPWindowComponent {

  @Input()
  public subMenu: Array<REPButton>;

  @Input()
  public uniqueID: number;

  @Output()
  public onSelection: EventEmitter<any> = new EventEmitter();

}
