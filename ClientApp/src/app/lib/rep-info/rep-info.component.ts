import { Component, Input } from '@angular/core';

@Component({
  selector: 'rep-info',
  templateUrl: './rep-info.component.html',
  styleUrls: ['./rep-info.component.scss']
})
export class REPInfoComponent {

  @Input()
  public background: string = "#FFFFFF";

  public tooltipVisible: boolean = false;

  toggleTooltip(): void {
    this.tooltipVisible = !this.tooltipVisible;
  }

}
