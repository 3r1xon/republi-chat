import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/services/utils.service';

@Component({
  selector: 'mtd-request',
  templateUrl: './mtd-request.component.html',
  styleUrls: ['./mtd-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MTDRequestComponent implements OnInit {

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
