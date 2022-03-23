import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { UtilsService } from 'src/services/utils.service';

@Component({
  selector: 'mtd-error',
  templateUrl: './mtd-error.component.html',
  styleUrls: ['./mtd-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MTDErrorComponent implements OnInit {

  constructor(
    public _utils: UtilsService,
  ) { }

  ngOnInit(): void {
    this.errorActions.map((func) => {
      const pre = func.onClick;

      func.onClick = () => {
        pre();
        this._utils.bugReport.visible = false;
      }
    });
  }

  public readonly errorActions: Array<REPButton> = [
    {
      name: "Close",
      background: "royalblue",
      icon: "close",
      onClick: () => {
        this.hideError();
      }
    },
  ];

  public hideError() {
    this._utils.bugReport.visible = false;
  }

}
