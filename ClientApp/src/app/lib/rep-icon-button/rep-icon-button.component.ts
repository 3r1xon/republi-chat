import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'rep-icon-button',
  templateUrl: './rep-icon-button.component.html',
  styleUrls: ['./rep-icon-button.component.scss']
})
export class REPIconButtonComponent {

  constructor() { }

  private readonly defColors = {
    success: "#46a35e",
    warning: "#F59E0B",
    danger: "#c62828"
  };

  @Input()
  public tooltip: string;

  private _color: string = "#ffffff";

  @Input()
  public set color(color: string) {
    if (color in this.defColors) this._color = this.defColors[color];
    else if (color != undefined) this._color = color;
  };

  public get color() {
    return this._color;
  }

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

  public hovering: boolean = false;

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

}
