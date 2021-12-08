import { Component, ElementRef, HostListener, Input, OnInit, Output } from '@angular/core';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'rep-window',
  templateUrl: './rep-window.component.html',
  styleUrls: ['./rep-window.component.scss']
})
export class REPWindowComponent implements OnInit {

  constructor(private eRef: ElementRef) { }

  ngOnInit(): void {
  }

  @Input()
  public subMenu: Array<REPButton>;
  
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
