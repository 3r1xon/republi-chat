import { Component, ElementRef, HostListener, Input, OnInit, Output } from '@angular/core';
import { SubMenu } from 'src/interfaces/submenu.interface';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'flat-window-menu',
  templateUrl: './flat-window-menu.component.html',
  styleUrls: ['./flat-window-menu.component.scss']
})
export class FlatWindowMenuComponent implements OnInit {

  constructor(private eRef: ElementRef) { }

  ngOnInit(): void {
  }

  @Input()
  public subMenu: Array<SubMenu>;
  
  public state: boolean = false;

  @Output()
  public open = new EventEmitter();

  openSubMenu() {
    this.state = !this.state;
    this.open.emit(this.state);
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.state = false;
      this.open.emit(this.state);
    }
  }

}
