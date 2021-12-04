import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SubMenu } from 'src/interfaces/submenu.interface';

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

  
  public options: Array<SubMenu> = [
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
    sections: Array<SubMenu> 
  }>;

  @Output()
  public onNew = new EventEmitter();

}
