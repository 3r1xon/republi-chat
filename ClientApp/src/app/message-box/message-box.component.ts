import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { format } from 'date-fns';
import { MessagesService } from 'src/services/messages.service';

@Component({
  selector: 'message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss']
})
export class MessageBoxComponent implements OnInit {

  constructor(public _msService: MessagesService) { }

  ngOnInit(): void {
  }

  public userImage: string = "/assets/user-image.png";

  public subMenuSections = [
    {
      name: "Delete",
      icon: "delete",
      color: "red",
      onClick: () => this.onDelete.emit('delete')
    },
    {
      name: "Edit",
      icon: "edit",
      color: "white",
      onClick: () => {
        this.onEdit.emit('onEdit');
        this.isEditing = !this.isEditing;
      }
    },
  ];

  public subMenuOpen: boolean = false;

  public isEditing: boolean = false;

  @Input()
  public text: string = "";

  @Input()
  public userName: string = "";

  @Input()
  public date: Date = new Date();

  @Input()
  public userColor: string = "#FFFFFF";

  @Output()
  public onDelete = new EventEmitter<string>();

  @Output()
  public onUserClick = new EventEmitter<string>();
  
  @Output()
  public onEdit = new EventEmitter<string>();

  dateFormatter() {
    return format(this.date, 'MM/dd/yyyy HH:mm');
  }

  openSubMenu() {
    this.subMenuOpen = !this.subMenuOpen;
  }
}
