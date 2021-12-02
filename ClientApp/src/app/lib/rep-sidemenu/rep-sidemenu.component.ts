import { Component, OnInit } from '@angular/core';
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
      icon: "trash",
      color: "red",
      onClick: () => {}
    }
  ]

  public tabs: any = [
    {
      tabname: "Channels",
      sections: [
        {
          sectionName: "Channel 1"
        }
      ]
    },
    {
      tabname: "Friends",
      sections: [
        {
          sectionName: "Friend 1"
        }
      ]
    }
  ]

}
