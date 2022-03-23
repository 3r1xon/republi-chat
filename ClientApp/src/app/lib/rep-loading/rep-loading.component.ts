import { ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'rep-loading',
  templateUrl: './rep-loading.component.html',
  styleUrls: ['./rep-loading.component.scss']
})
export class REPLoadingComponent {

  constructor(
    private cd: ChangeDetectorRef
  ) {
    this.cd.detach();
  }

}
