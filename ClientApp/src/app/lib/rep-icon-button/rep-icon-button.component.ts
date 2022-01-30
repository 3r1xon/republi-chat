import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'rep-icon-button',
  templateUrl: './rep-icon-button.component.html',
  styleUrls: ['./rep-icon-button.component.scss']
})
export class REPIconButtonComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input()
  public tooltip: string;

}
