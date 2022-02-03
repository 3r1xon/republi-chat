import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'rep-icon-button',
  templateUrl: './rep-icon-button.component.html',
  styleUrls: ['./rep-icon-button.component.scss']
})
export class REPIconButtonComponent {

  private readonly defColors = {
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
    if (color in this.defColors) this._color = this.defColors[color];
    else if (color != undefined) this._color = color;
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
    if (typeof this._enabled == 'boolean') return this._enabled;
    else return this._enabled(this.uniqueID);
  }

  private _visible: boolean | ((uniqueID: number) => boolean) = true;

  @Input()
  public set visible(boolean) {
    if (boolean != undefined) {
      this._visible = boolean;
    }
  }

  public get visible() {
    if (typeof this._visible == 'boolean') return this._visible;
    else return this._visible(this.uniqueID);
  }

  @Input()
  public uniqueID: number;

  @Output()
  public onClick: EventEmitter<boolean> = new EventEmitter();

  checkClick() {
    if (!this.enabled) return;

    this.onClick.emit();
  }

}
