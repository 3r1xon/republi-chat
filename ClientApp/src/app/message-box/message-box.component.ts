import { 
  Component, 
  Input, 
  Output, 
  OnInit, 
  EventEmitter, 
  HostListener,
  ElementRef
} from '@angular/core';
import { format } from 'date-fns';
import { SubMenu } from 'src/interfaces/submenu.interface';
import { MessagesService } from 'src/services/messages.service';

@Component({
  selector: 'message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss']
})
export class MessageBoxComponent implements OnInit {

  constructor(
    public _msService: MessagesService,
    private eRef: ElementRef
    ) { }

  ngOnInit(): void {
  }

  public userImage: string = "/assets/user-image.png";

  public active: boolean = false;

  @Input()
  public options: Array<SubMenu> = [
    {
      name: "Delete",
      icon: "delete",
      color: "red",
      onClick: () => {
      }
    },
    {
      name: "Edit",
      icon: "edit",
      color: "white",
      onClick: () => {
      }
    },
  ];


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

  setToggle($event) {
    this.active = $event;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target))
      this.active = false;
  }

}
