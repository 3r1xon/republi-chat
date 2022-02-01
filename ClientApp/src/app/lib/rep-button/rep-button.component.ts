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

  private _background: string = "royalblue";

  @Input()
  public set background(color: string) {
    if (color in this.defColors) this._background = this.defColors[color];
    else if (color != undefined) this._background = color;
  };

  public get background() {
    return this._background;
  }

  @Input()
  public set color(color: string) {
    if (color in this.defColors) this.fontColor = this.defColors[color];
    else if (color != undefined) this.fontColor = color;
  }

  @Input()
  public outline: boolean = false;

  public fontColor: string = "#FFFFFF";

  private _enabled: boolean | (() => boolean) = true;
  private _visible: boolean | (() => boolean) = true;

  @Input()
  public set enabled(boolean) {
    if (boolean != undefined) {
      this._enabled = boolean;
    }
  };

  public get enabled() {
    if (typeof this._enabled == 'boolean') return this._enabled;
    else return this._enabled();
  }

  @Input()
  public set visible(boolean) {
    if (boolean != undefined) {
      this._visible = boolean;
    }
  }

  public get visible() {
    if (typeof this._visible == 'boolean') return this._visible;
    else return this._visible();
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