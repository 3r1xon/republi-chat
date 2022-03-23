import { ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'rep-separator',
  templateUrl: './rep-separator.component.html',
  styleUrls: ['./rep-separator.component.scss']
})
export class REPSeparatorComponent {

  constructor(
    private cd: ChangeDetectorRef
  ) {
    this.cd.detach();
  }
}
