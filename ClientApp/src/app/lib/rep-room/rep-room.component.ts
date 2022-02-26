import { Component, Input } from '@angular/core';

@Component({
  selector: 'rep-room',
  templateUrl: './rep-room.component.html',
  styleUrls: ['./rep-room.component.scss']
})
export class REPRoomComponent {

  @Input() roomName: string = "Name";

  @Input() textRoom: boolean = true;

}
