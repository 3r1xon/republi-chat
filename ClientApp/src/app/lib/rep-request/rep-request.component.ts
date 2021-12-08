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
  }

  public enable() {
    this._utils.rqsBody.visible = true;
  }

  public disable() {
    this._utils.rqsBody.visible = false;
  }


}
