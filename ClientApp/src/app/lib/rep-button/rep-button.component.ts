import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'rep-button',
  templateUrl: './rep-button.component.html',
  styleUrls: ['./rep-button.component.scss']
})
export class REPButtonComponent {

  constructor() { }

  private readonly defColors = {
    success: "#46a35e",
    warning: "#F59E0B",
    danger: "#c62828"
  };

  @Input()
  public icon: string = "open_in_new";

  @Input()
  public set background(color: string) {
    if (color in this.defColors) this.backColor = this.defColors[color];
    else this.backColor = color;
  };

  public backColor: string = "royalblue";

  @Input()
  public color: string = "#FFFFFF";

  @Input()
  public enabled: boolean = true;

  @Output()
  public onClick: EventEmitter<boolean> = new EventEmitter();

  checkClick() {
    if (!this.enabled) return;

    this.onClick.emit();
  }
}