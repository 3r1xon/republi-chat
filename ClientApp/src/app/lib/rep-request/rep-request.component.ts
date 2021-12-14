import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/services/utils.service';

@Component({
  selector: 'rep-request',
  templateUrl: './rep-request.component.html',
  styleUrls: ['./rep-request.component.scss']
})
export class REPRequestComponent implements OnInit {

  constructor(
    public _utils: UtilsService
  ) { }

  ngOnInit(): void {
    this._utils.rqsBody?.actions.map((func) => {

      func.onClick ??= () => { };

      const pre = func.onClick;

      func.onClick = () => {
        pre();
        this._utils.rqsBody.visible = false;
      }
    });
  }

  public showRequest() {
    this._utils.rqsBody.visible = true;
  }

  public hideRequest() {
    this._utils.rqsBody.visible = false;
  }
}
