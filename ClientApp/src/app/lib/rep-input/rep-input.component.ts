import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'rep-input',
  templateUrl: './rep-input.component.html',
  styleUrls: ['./rep-input.component.scss'],
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

    trigger('openClose', [
      state('false', style({
        opacity: '0',
      })),
      state('true', style({
        opacity: '1',
      })),
      transition('true <=> false', animate('150ms')),
    ]),
  ],
})
export class REPInputComponent implements OnInit{

  ngOnInit() {
    if (this.text != '') {
      this.placeholderAnimated = true;
    }
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

  @Input()
  public hint?: string;

  @Input()
  public text: string = '';

  @Input()
  public size: string = 'big' || 'medium' || 'small';

  @Input()
  public set enabled(flag) {
    if (!flag) {
      this.disabled = true;
      this.color = 'grey';
    } else {
      this.disabled = false;
      this.color = 'royalblue';
    }
  }

  @Input()
  public tooltip: string = "";

  @Input()
  public required: boolean = false;

  public disabled: boolean = false;

  public tooltipVisible: boolean = false;


  @Output()
  textChange = new EventEmitter<string>();
  public empty: boolean = false;
  public placeholderAnimated: boolean = false;
  constructor() { }
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

  toggleTooltip() {
    this.tooltipVisible = !this.tooltipVisible;
  }

}