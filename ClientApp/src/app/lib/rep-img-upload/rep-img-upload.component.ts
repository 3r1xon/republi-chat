import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'rep-img-upload',
  templateUrl: './rep-img-upload.component.html',
  styleUrls: ['./rep-img-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class REPImgUploadComponent {

  @Input()
  public src: string;

  @Input()
  public letter: string;

  @Input()
  public backgroundColor: string;

  @Output()
  public image: EventEmitter<any> = new EventEmitter();

  onChange(event: any) {
    this.image.emit(event);
  }
}
