import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'rep-icon-button',
  templateUrl: './rep-icon-button.component.html',
  styleUrls: ['./rep-icon-button.component.scss']
})
export class REPIconButtonComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input()
  public tooltip: string;

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

}
