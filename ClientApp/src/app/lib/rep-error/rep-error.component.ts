import { Component, OnInit } from '@angular/core';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { UtilsService } from 'src/services/utils.service';

@Component({
  selector: 'rep-error',
  templateUrl: './rep-error.component.html',
  styleUrls: ['./rep-error.component.scss']
})
export class REPErrorComponent implements OnInit {

  constructor(
    public _utils: UtilsService
  ) { }

  ngOnInit(): void {
  }

  public readonly errorActions: Array<REPButton> = [
    {
      name: "Close",
      background: "royalblue",
      onClick: () => {
        this.hideError();
      }
    }
  ];

  public hideError() {
    this._utils.bugReport.visible = false;
  }

}
