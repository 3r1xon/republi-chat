import { Component } from '@angular/core';
import { UtilsService } from 'src/services/utils.service';

@Component({
  selector: 'mtd-loading',
  templateUrl: './mtd-loading.component.html',
  styleUrls: ['./mtd-loading.component.scss']
})
export class MTDLoadingComponent {

  constructor(
    public _utils: UtilsService
  ) { }

}
