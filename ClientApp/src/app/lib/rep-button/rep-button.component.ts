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

  public tooltipVisible: boolean = false;

  @Input()
  public tooltip: string;

  @Input()
  public icon: string = "open_in_new";

  @Input()
  public set background(color: string) {
    this.defColors[color] ? this.backColor = this.defColors[color] : this.backColor = color;
  };

  public backColor: string = "royalblue";

  @Input()
  public set color(color: string) {
    this.defColors[color] ? this.fontColor = this.defColors[color] : this.fontColor = color;
  }

  public fontColor: string = "#FFFFFF";

  @Input()
  public enabled: boolean | (() => boolean) = true;

  public get disabled() {
    if (typeof this.enabled == 'boolean') return this.enabled;
    else return this.enabled();
  }

  @Output()
  public onClick: EventEmitter<boolean> = new EventEmitter();

  checkClick() {
    if (!this.enabled) return;

    this.onClick.emit();
  }

  toggleTooltip() {
    if (this.tooltip)
      this.tooltipVisible = !this.tooltipVisible;
  }
}