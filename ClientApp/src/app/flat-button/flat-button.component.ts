import { Component, Input } from '@angular/core';

@Component({
  selector: 'flat-button',
  templateUrl: './flat-button.component.html',
  styleUrls: ['./flat-button.component.scss']
})
export class FlatButtonComponent {

  constructor() { }

  @Input()
  public icon: string = "open_in_new";
  @Input()
  public background: string = "royalblue";
  @Input()
  public width: string = "200px";
  @Input()
  public height: string = "auto";
}