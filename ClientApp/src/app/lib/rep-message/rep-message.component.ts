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
import { Message } from 'src/interfaces/message.interface';
import { SubMenu } from 'src/interfaces/submenu.interface';
import { MessagesService } from 'src/services/messages.service';

@Component({
  selector: 'rep-message',
  templateUrl: './rep-message.component.html',
  styleUrls: ['./rep-message.component.scss']
})
export class REPMessageComponent implements OnInit {

  constructor(
    public _msService: MessagesService,
    private eRef: ElementRef
    ) { }

  ngOnInit(): void {
    if (this.message.auth) {
      this.options = [
        {
          name: "Delete",
          icon: "delete",
          color: "#ff0000",
          onClick: async () => {
            await this._msService.deleteMessage(this.message.id);
          }
        },
        {
          name: "Edit",
          icon: "edit",
          color: "#ffffff",
          onClick: () => {
          }
        },
        {
          name: "Report",
          icon: "flag",
          color: "#ffffff",
          onClick: () => {
          }
        },
      ];
    } else {
      this.options = [
        {
          name: "Report",
          icon: "flag",
          color: "#ffffff",
          onClick: () => {
          }
        },
      ];
    }
  }

  public active: boolean = false;

  public userImage: string = "";

  @Input()
  public uniqueID: number;

  @Input()
  public options: Array<SubMenu> = [];

  @Input()
  public message: Message;

  @Output()
  public onUserClick = new EventEmitter<string>();


  dateFormatter() {
    return format(this.message.date, 'MM/dd/yyyy HH:mm');
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
