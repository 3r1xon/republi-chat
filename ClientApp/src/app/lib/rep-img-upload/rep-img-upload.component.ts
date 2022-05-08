import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
export class REPImgUploadComponent implements OnInit, ControlValueAccessor {

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.sanitizeIMG();
  }

  @Input()
  public src: SafeResourceUrl;

  @Input()
  public letter: string;

  @Input()
  public backgroundColor: string;

  @Output()
  public image: EventEmitter<any> = new EventEmitter();

  sanitizeIMG() {
    if (this.src == null) return;

    const extensions = {
      "/": "jpg",
      "i": "png",
      "R": "gif",
      "U": "webp"
    };

    this.src = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/${extensions[this.src[0]]};base64,` + this.src);
  }

  onChange: any = () => {
    this.image.emit(this.src);
  };

  onTouch: any = () => { };

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(file: any) {
    if (typeof file == 'string') {
      this.src = file;

      this.sanitizeIMG();

    } else {

      file = file[0];

      const reader = new FileReader();

      reader.onload = this.handleReaderLoaded.bind(this);

      reader.readAsBinaryString(file);

      this.image.emit(this.src);

      this.onChange(this.src);

    }
  }

  handleReaderLoaded(e) {
    this.src = 'data:image/png;base64,' + btoa(e.target.result);
  }
}
