import { Component, Input } from '@angular/core';
import { REPButton } from 'src/interfaces/repbutton.interface';

@Component({
  selector: 'rep-actions',
  templateUrl: './rep-actions.component.html',
  styleUrls: ['./rep-actions.component.scss']
})
export class REPActionsComponent {

  constructor() { }

  @Input()
  public actions: Array<REPButton>;

  @Input()
  public reverse: boolean = false;
}
