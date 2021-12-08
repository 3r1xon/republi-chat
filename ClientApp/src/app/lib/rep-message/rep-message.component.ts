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
import { REPButton } from 'src/interfaces/repbutton.interface';
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
    
    if (this.options) return;

    if (this.message.auth) {
      this.options = [
        {
          name: "Delete",
          icon: "delete",
          color: "#c62828",
          onClick: async () => {
            await this._msService.deleteMessage(this.message.id);
          }
        },
        {
          name: "Edit",
          icon: "edit",
          onClick: () => {
          }
        },
        {
          name: "Report",
          icon: "flag",
          onClick: () => {
          }
        },
      ];
    } else {
      this.options = [
        {
          name: "Report",
          icon: "flag",
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
  public options: Array<REPButton>;

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
