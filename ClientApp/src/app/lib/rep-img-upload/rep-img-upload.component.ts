import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'rep-img-upload',
  templateUrl: './rep-img-upload.component.html',
  styleUrls: ['./rep-img-upload.component.scss'],
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
  public src: SafeResourceUrl;

  @Input()
  public letter: string;

  @Input()
  public backgroundColor: string;

  @Input()
  public maxSize: number;

  @Output()
  public image: EventEmitter<any> = new EventEmitter();

  onChange: any = () => { };

  onTouch: any = () => { };

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(file: any) {
    if (file == null) return;

    if (typeof file == 'string') {
      this.src = file;

    } else {

      if (file.length == 0) return;

      file = file[0];

      if (this.maxSize && file.size > this.maxSize) {
        return;
      }

      const reader = new FileReader();

      reader.onload = this.handleReaderLoaded.bind(this);

      reader.readAsBinaryString(file);

      this.image.emit(file);

      this.onChange(file);

    }
  }

  handleReaderLoaded(e) {
    this.src = 'data:image/png;base64,' + btoa(e.target.result);
  }
}
