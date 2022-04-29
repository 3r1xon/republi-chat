import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'rep-toggle',
  templateUrl: './rep-toggle.component.html',
  styleUrls: ['./rep-toggle.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => REPToggleComponent)
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class REPToggleComponent implements ControlValueAccessor {

  @Input()
  public checked: boolean = false;

  @Input()
  public iconOnTrue: string;

  @Input()
  public iconOnFalse: string;

  @Output()
  public checkedChange: EventEmitter<boolean> = new EventEmitter();

  onChange: any = () => {
    this.checkedChange.emit(this.checked);
  };

  onTouch: any = () => { };

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {

  }

  writeValue(flag: boolean) {
    this.checked = flag;
  }

}
