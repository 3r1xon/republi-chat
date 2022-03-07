import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { EventEmitter } from '@angular/core'
import { REPWindowComponent } from '../rep-window/rep-window.component';

@Component({
  selector: 'rep-more',
  templateUrl: './rep-more.component.html',
  styleUrls: ['./rep-more.component.scss']
})
export class REPMoreComponent {

  constructor(
    private eRef: ElementRef,
    private cd: ChangeDetectorRef
  ) { }

  @Input()
  public subMenu: Array<REPButton>;

  @Input()
  public state: boolean = false;

  @Output()
  public open = new EventEmitter();

  @Input()
  public uniqueID: number;

  @ViewChild(REPWindowComponent, { read: ElementRef })
  private submenu: ElementRef;

  public offsetX: number;

  public offsetY: number;

  openSubMenu(event) {

    if (!this.state) {
      this.state = true;

      this.cd.detectChanges();
    }

    const winWidth = this.submenu.nativeElement.offsetWidth;
    const winHeight = this.submenu.nativeElement.offsetHeight;

    if (event.clientX + winWidth > window.innerWidth) {
      this.offsetX = event.pageX - winWidth;
    } else {
      this.offsetX = event.pageX;
    }

    if (event.clientY + winHeight > window.innerHeight) {
      this.offsetY = event.pageY - winHeight;
    } else {
      this.offsetY = event.pageY;
    }

    this.open.emit(this.state);
  }


  @HostListener('window:resize', ['$event'])
  onResize() {
    this.state = false;

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