import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'rep-toggle',
  templateUrl: './rep-toggle.component.html',
  styleUrls: ['./rep-toggle.component.scss']
})
export class REPToggleComponent {

  @Input()
  public checked: boolean = false;

  @Output()
  public checkedChange: EventEmitter<boolean> = new EventEmitter();

  @Input()
  public iconOnTrue: string = "";

  @Input()
  public iconOnFalse: string = "";

}
