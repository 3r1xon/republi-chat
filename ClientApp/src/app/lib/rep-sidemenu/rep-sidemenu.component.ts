import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rep-sidemenu',
  templateUrl: './rep-sidemenu.component.html',
  styleUrls: ['./rep-sidemenu.component.scss']
})
export class REPSidemenuComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public tabs: Array<string> = [
    "Channels",
    "Friends"
  ]

}
