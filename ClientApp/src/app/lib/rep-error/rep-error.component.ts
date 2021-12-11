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
      name: "Send report",
      background: "warning",
      icon: "report_problem",
      onClick: () => {
        console.log("Report unavailable");
      }
    },
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
