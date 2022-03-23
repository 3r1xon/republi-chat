import { Component, Input, OnInit } from '@angular/core';
import { Account } from 'src/interfaces/account.interface';
import { expand } from '../rep-animations';

@Component({
  selector: 'rep-room',
  templateUrl: './rep-room.component.html',
  styleUrls: ['./rep-room.component.scss'],
  animations: [
    expand("100ms")
  ]
})
export class REPRoomComponent {

  @Input() roomName: string = "";

  @Input() textRoom: boolean = true;

  @Input() hold: boolean = false;

  @Input() members: Array<Account> = [];

  @Input() expanded: boolean = false;

  @Input() notifications: number = 0;

}
