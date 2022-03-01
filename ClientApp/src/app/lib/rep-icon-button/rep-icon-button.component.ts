import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'rep-icon-button',
  templateUrl: './rep-icon-button.component.html',
  styleUrls: ['./rep-icon-button.component.scss'],
  host: {
    'role': 'button',
    'tabindex': '0',
    '(keypress)': 'checkClick($event)'
  }
})
export class REPIconButtonComponent {

  private readonly DEFAULT_COLORS = {
    success: "#46a35e",
    warning: "#F59E0B",
    danger: "#c62828"
  };

  @Input()
  public tooltip: string;

  private _color: string = "#ffffff";

  public hovering: boolean = false;

  @Input()
  public set color(color: string) {
    if (color in this.DEFAULT_COLORS)
      this._color = this.DEFAULT_COLORS[color];
    else if (color != undefined)
      this._color = color;
  };

  public get color() {
    return this._color;
  }

  private _enabled: boolean | ((uniqueID: number) => boolean) = true;

  @Input()
  public set enabled(boolean) {
    if (boolean != undefined) {
      this._enabled = boolean;
    }
  };

  public get enabled() {
    if (typeof this._enabled == 'boolean')
      return this._enabled;

    return this._enabled(this.uniqueID);
  }

  private _visible: boolean | ((uniqueID: number) => boolean) = true;

  @Input()
  public set visible(boolean) {
    if (boolean != undefined) {
      this._visible = boolean;
    }
  }

  public get visible() {
    if (typeof this._visible == 'boolean')
      return this._visible;

    return this._visible(this.uniqueID);
  }

  @Input()
  public uniqueID: number;

  @Output()
  public onClick: EventEmitter<any> = new EventEmitter();

  checkClick(event) {
    if (!this.enabled) return;

    this.onClick.emit(event);
  }

}
