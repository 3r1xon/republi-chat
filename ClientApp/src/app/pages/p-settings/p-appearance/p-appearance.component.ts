import { Component } from '@angular/core';
import { UtilsService } from 'src/services/utils.service';

@Component({
  templateUrl: './p-appearance.component.html',
  styleUrls: ['./p-appearance.component.scss']
})
export class PAppearanceComponent {

  constructor(
    public _utils: UtilsService
  ) { }


}
