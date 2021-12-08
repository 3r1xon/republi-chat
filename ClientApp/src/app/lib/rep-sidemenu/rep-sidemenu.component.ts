import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { REPButton } from 'src/interfaces/repbutton.interface';

@Component({
  selector: 'rep-sidemenu',
  templateUrl: './rep-sidemenu.component.html',
  styleUrls: ['./rep-sidemenu.component.scss']
})
export class REPSidemenuComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public selectedTab: number = 0;

  
  public options: Array<REPButton> = [
    {
      name: "Remove",
      icon: "delete",
      color: "#c62828",
      onClick: () => {}
    }
  ];

  @Input()
  public entries: Array<{ 
    tabname: string, 
    sections: Array<REPButton> 
  }>;

  @Output()
  public onNew = new EventEmitter();

}
