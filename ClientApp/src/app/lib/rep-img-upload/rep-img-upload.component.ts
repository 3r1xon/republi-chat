import {
  ChangeDetectionStrategy,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  private base64textString = [];

  onChange: any = () => { };

  onTouch: any = () => { };

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

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {

  }

  writeValue(file: any) {
    if (file) {
      this.src = file;

      file = file[0];

      console.log(file);
      if (file) {

        this.sanitizeIMG();
        const reader = new FileReader();

        reader.onload = this.handleReaderLoaded.bind(this);

        if(this.base64textString.length > 0) {

          reader.readAsBinaryString(file);

          console.log(file)

          this.image.emit(this.base64textString);
        }
      }

    }
  }

  handleReaderLoaded(e) {
    this.base64textString.push('data:image/png;base64,' + btoa(e.target.result));
  }
}
