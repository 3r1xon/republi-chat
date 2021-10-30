import { Component, Input, OnInit } from '@angular/core';
import { format } from 'date-fns';

@Component({
  selector: 'message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss']
})
export class MessageBoxComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public userImage: string = "/assets/user-image.png";

  @Input()
  public userName: string = "";

  @Input()
  public date: Date = new Date();

  @Input()
  public userColor: string = "#FFFFFF";

  formatter() {
    return format(this.date, 'MM/dd/yyyy HH:mm');
  }
}
