import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'rep-toggle',
  templateUrl: './rep-toggle.component.html',
  styleUrls: ['./rep-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class REPToggleComponent {

  @Input()
  public checked: boolean = false;

  @Input()
  public iconOnTrue: string = "";

  @Input()
  public iconOnFalse: string = "";

  @Output()
  public checkedChange: EventEmitter<boolean> = new EventEmitter();

}
