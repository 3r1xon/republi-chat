import { Component, Input } from '@angular/core';

@Component({
  selector: 'rep-button',
  templateUrl: './rep-button.component.html',
  styleUrls: ['./rep-button.component.scss']
})
export class REPButtonComponent {

  constructor() { }

  @Input()
  public icon: string = "open_in_new";
  @Input()
  public background: string = "royalblue";
  @Input()
  public width: string = "auto";
  @Input()
  public height: string = "auto";
}