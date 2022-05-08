import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'rep-tabs',
  templateUrl: './rep-tabs.component.html',
  styleUrls: ['./rep-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class REPTabsComponent {

  @Input()
  public entries: Array<{
    tabname: string,
    icon: string
  }>;

  @Input()
  public add: boolean = true;

  @Input()
  public theme: string = "royalblue";

  @Output()
  public onNew = new EventEmitter();

  @Output()
  public onTab = new EventEmitter();

  public currentIndex: number = 0;

  selectTab(index: number) {
    this.onTab.emit(index);
    this.currentIndex = index;
  }

}
