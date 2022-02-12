import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'rep-img-upload',
  templateUrl: './rep-img-upload.component.html',
  styleUrls: ['./rep-img-upload.component.scss']
})
export class REPImgUploadComponent {

  @Input()
  public src: any = "/assets/upload.png";

  @Output()
  public image: EventEmitter<any> = new EventEmitter();

  onChange(event: any) {
    this.image.emit(event);
  }
}
