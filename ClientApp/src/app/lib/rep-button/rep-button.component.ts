import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'rep-button',
  host: {
    "[style.opacity]": "enabled ? '1' : '0.5'",
  },
  templateUrl: './rep-button.component.html',
  styleUrls: ['./rep-button.component.scss']
})
export class REPButtonComponent {

  private readonly DEFAULT_COLORS = {
    success: "#46a35e",
    warning: "#F59E0B",
    danger: "#c62828"
  };

  @Input()
  public tooltip: string;

  @Input()
  public icon: string = "open_in_new";

  private _type: string = "button";

  @Input()
  public set type(tp: string) {
    if (tp != undefined) {
      this._type = tp;
    }
  };

  public get type() {
    return this._type;
  }

  private _background: string = "royalblue";

  @Input()
  public set background(color: string) {
    if (color in this.DEFAULT_COLORS)
      this._background = this.DEFAULT_COLORS[color];
    else if (color != undefined)
      this._background = color;
  };

  public get background() {
    return this._background;
  }

  public _color: string = "#FFFFFF";

  @Input()
  public set color(color: string) {
    if (color in this.DEFAULT_COLORS)
      this._color = this.DEFAULT_COLORS[color];
    else if (color != undefined)
      this._color = color;
  }

  public get color() {
    return this._color;
  }

  @Input()
  public outline: boolean = false;

  private _enabled: boolean | ((uniqueID: number) => boolean) = () => true;

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

  private _visible: boolean | ((uniqueID: number) => boolean) = () => true;

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
  public autofocus: boolean = false;

  @Input()
  public uniqueID: number;

  @Output()
  public onClick: EventEmitter<any> = new EventEmitter();

  checkClick(event) {
    if (!this.enabled) return;

    this.onClick.emit(event);
  }
}
