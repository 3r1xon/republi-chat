import { Component, Input, OnInit } from '@angular/core';
import { REPButton } from 'src/interfaces/repbutton.interface';

@Component({
  selector: 'rep-actions',
  templateUrl: './rep-actions.component.html',
  styleUrls: ['./rep-actions.component.scss']
})
export class REPActionsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input()
  public actions: Array<REPButton>;
}
