import { Component } from '@angular/core';
import { UtilsService } from 'src/services/utils.service';

@Component({
  selector: 'rep-loading',
  templateUrl: './rep-loading.component.html',
  styleUrls: ['./rep-loading.component.scss']
})
export class REPLoadingComponent {

  constructor(public _utils: UtilsService) { }
}
