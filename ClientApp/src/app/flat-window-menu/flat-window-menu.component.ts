import { Component, ElementRef, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'flat-window-menu',
  templateUrl: './flat-window-menu.component.html',
  styleUrls: ['./flat-window-menu.component.scss']
})
export class FlatWindowMenuComponent implements OnInit {

  constructor(private eRef: ElementRef) { }

  ngOnInit(): void {
  }

  public subMenuSections = [
    {
      name: "Delete",
      icon: "delete",
      color: "red",
      onClick: () => {} //this.onDelete.emit('delete')
    },
    {
      name: "Edit",
      icon: "edit",
      color: "white",
      onClick: () => {
        // this.onEdit.emit('onEdit');
        // this.isEditing = !this.isEditing;
      }
    },
  ];

  public subMenuOpen: boolean = false;

  openSubMenu() {
    this.subMenuOpen = !this.subMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target))
      this.subMenuOpen = false;
  }

}
