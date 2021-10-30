import {Component, Input, Output, EventEmitter} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'flat-input',
  templateUrl: './flat-input.component.html',
  styleUrls: ['./flat-input.component.scss'],
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
export class FlatInputComponent {
    @Input()
    type: string = "text";
    @Input()
    placeholder: string = 'Placeholder example';
    @Input()
    color: string = 'royalblue';
    @Input()
    icon?: string;
    @Input()
    hint?: string;
    @Input()
    text: string = '';
    @Input()
    size: string = 'big' || 'medium' || 'small';
    @Output()
    textChange = new EventEmitter<string>();

    public placeholderAnimated: boolean = false;
    constructor() { }
    onFocus() {
      this.placeholderAnimated = true;
    }
    onFocusOut() {
      if (!this.text) this.placeholderAnimated = false;
      if (this.text.length > 0) return;
      this.placeholderAnimated = false;
    }
    getPlaceholder() {
      if (!this.placeholderAnimated) return '';
      return this.placeholder;
    }
}