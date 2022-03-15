import { Component, Input } from '@angular/core';

@Component({
  selector: 'rep-loading',
  templateUrl: './rep-loading.component.html',
  styleUrls: ['./rep-loading.component.scss']
})
export class REPLoadingComponent {

  @Input()
  public loading: boolean = false;
}
