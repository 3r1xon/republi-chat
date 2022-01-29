import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  OnInit
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'rep-textarea',
  templateUrl: './rep-textarea.component.html',
  styleUrls: ['./rep-textarea.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => REPTextareaComponent)
    }
  ],
})
export class REPTextareaComponent implements OnInit, ControlValueAccessor {

  constructor(
  ) { }

  ngOnInit(): void {
    this.prevValue = this.text;
  }

  private prevValue: string;

  @Input()
  public enabled: boolean = true;

  @Input()
  public text: string = '';

  @Input()
  public placeholder: string = '';

  @Input()
  public rows: number = 20;

  @Input()
  public cols: number = 50;

  @Input()
  public background: string = "#95959536";

  @Input()
  public maxLength: number = 2000;

  @Output()
  public send = new EventEmitter();

  @Output()
  public textChange = new EventEmitter<string>();

  submitHandler(event: any) {
    event.preventDefault();
    if (!this.enabled) return;
    this.send.emit(event);
  }

  onChange: any = () => {
    this.textChange.emit(this.text);
  }

  onTouch: any = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    if (this.text != this.prevValue) {
      this.onTouch = fn;
    }
  }

  writeValue(text: string) {
    this.text = text;
  }

}
