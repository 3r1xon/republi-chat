import { Component, Input, Output, EventEmitter, OnInit, forwardRef } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'rep-input',
  templateUrl: './rep-input.component.html',
  styleUrls: ['./rep-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => REPInputComponent)
    }
  ],
  animations: [
    trigger('placeholderAnimated', [
      state('static', style({
        fontSize: '*',
        top: '*',
        left: '*',
      })),
      state('moved', style({
        fontSize: '13px',
        top: '-15px',
        left: '5px',
      })),
      transition('* <=> *', [
        animate('50ms ease-in-out'),
      ]),
    ]),
  ],
})
export class REPInputComponent implements OnInit, ControlValueAccessor {

  ngOnInit() {
    this.placeholderAnimated = this.text != '';
    this.prevValue = this.text;
  }

  @Input()
  public type: string = "text";

  @Input()
  public placeholder: string = 'Placeholder example';

  @Input()
  public color: string = 'royalblue';

  @Input()
  public borderColor: string = "grey";

  @Input()
  public icon?: string;

  private _text: string = '';

  @Input()
  public set text(txt: string) {
    txt ??= '';
    this._text = txt;
  };

  public get text() {
    return this._text;
  }

  @Input()
  public size: string = 'big' || 'medium' || 'small';

  @Input()
  public maxLength: number;

  @Input()
  public autocomplete: string = "off";

  @Input()
  public set enabled(flag: boolean) {
    this.disabled = !flag;
    this.color = !flag ? 'grey' : 'royalblue';
  }

  @Input()
  public tooltip: string;

  @Input()
  public required: boolean = false;

  public disabled: boolean = false;

  public tooltipVisible: boolean = false;

  private prevValue: string;

  @Output()
  public textChange = new EventEmitter<string>();

  public empty: boolean = false;

  public placeholderAnimated: boolean = false;

  onFocus() {
    this.placeholderAnimated = true;
  }

  onFocusOut() {
    if (this.required && this.text == "") {
      this.borderColor = "#ff0000";
      this.empty = true;
    } else this.empty = false;
    if (!this.text) this.placeholderAnimated = false;
    if (this.text.length > 0) return;
    this.placeholderAnimated = false;
  }

  getPlaceholder() {
    if (!this.placeholderAnimated) return '';
    return this.placeholder;
  }

  onChange: any = () => {
    this.textChange.emit(this.text);
  };

  onTouch: any = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    if (this.text != this.prevValue) {
      this.onTouch = fn;
      this.placeholderAnimated = true;
    }
  }

  writeValue(text: string) {
    this.text = text;
  }

}
