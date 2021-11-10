import { 
  Component, 
  Input, 
  Output, 
  OnInit, 
  EventEmitter,
  HostListener,
  ElementRef } from '@angular/core';
import { format } from 'date-fns';
import { MessagesService } from 'src/services/messages.service';

@Component({
  selector: 'message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss']
})
export class MessageBoxComponent implements OnInit {

  constructor(
    public _msService: MessagesService,
    ) { }

  ngOnInit(): void {
  }

  public userImage: string = "/assets/user-image.png";

  @Input()
  public text: string = "";

  @Input()
  public userName: string = "";

  @Input()
  public date: Date = new Date();

  @Input()
  public userColor: string = "#FFFFFF";
  
  @Output()
  public onUserClick = new EventEmitter<string>();

  dateFormatter() {
    return format(this.date, 'MM/dd/yyyy HH:mm');
  }

}
