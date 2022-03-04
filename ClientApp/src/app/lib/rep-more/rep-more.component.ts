import {
  Component,
  Input,
  Output,
} from '@angular/core';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { EventEmitter } from '@angular/core'

@Component({
  selector: 'rep-more',
  templateUrl: './rep-more.component.html',
  styleUrls: ['./rep-more.component.scss']
})
export class REPMoreComponent {

  @Input()
  public subMenu: Array<REPButton>;

  @Input()
  public state: boolean = false;

  @Output()
  public open = new EventEmitter();

  @Input()
  public uniqueID: number;

  openSubMenu(event) {

    this.state = true;

    this.open.emit(this.state);
  }
}
