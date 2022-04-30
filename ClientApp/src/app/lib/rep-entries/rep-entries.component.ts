import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'rep-entries',
  templateUrl: './rep-entries.component.html',
  styleUrls: ['./rep-entries.component.scss']
})
export class REPEntriesComponent {

  @Input()
  public show: boolean = true;

  @Output()
  public showChange: EventEmitter<boolean> = new EventEmitter();

  close() {
    this.show = false;
    this.showChange.emit(this.show);
  }

}
