import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'rep-sidemenu',
  templateUrl: './rep-sidemenu.component.html',
  styleUrls: ['./rep-sidemenu.component.scss']
})
export class REPSidemenuComponent {

  @Input()
  public entries: Array<{ 
    tabname: string, 
    icon: string
  }>;

  @Output()
  public onNew = new EventEmitter();

  @Output()
  public onTab = new EventEmitter();

  @Input()
  public add: boolean = true;

  public currentIndex: number = 0;

  selectTab(index: number) {
    this.onTab.emit(index);
    this.currentIndex = index;
  }

}
