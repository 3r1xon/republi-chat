import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'rep-info',
  templateUrl: './rep-info.component.html',
  styleUrls: ['./rep-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class REPInfoComponent {

  @Input()
  public background: string = "#ffffff98";

  @Input()
  public tooltip: string;
}
