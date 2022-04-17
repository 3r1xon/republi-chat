import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'rep-img-upload',
  templateUrl: './rep-img-upload.component.html',
  styleUrls: ['./rep-img-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => REPImgUploadComponent)
    }
  ]
})
export class REPImgUploadComponent implements ControlValueAccessor {

  @Input()
  public src: string;

  @Input()
  public letter: string;

  @Input()
  public backgroundColor: string;

  @Output()
  public image: EventEmitter<any> = new EventEmitter();

  // onChange(event: any) {
  //   this.image.emit(event);
  // }

  onChange: any = () => {
    this.image.emit(event);
  };

  onTouch: any = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {

  }

  writeValue(text: string) {

  }
}
