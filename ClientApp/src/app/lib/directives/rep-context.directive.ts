import {
  ComponentFactoryResolver,
  Directive,
  HostListener,
  Input,
  ViewContainerRef
} from '@angular/core';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { REPWindowComponent } from '../rep-window/rep-window.component';

@Directive({
  selector: '[repContext]',
})
export class REPContextDirective {

  constructor(
    private viewContainer: ViewContainerRef,
    private componentFactory: ComponentFactoryResolver
  ) { }

  @HostListener("contextmenu", ["$event"])
  public onContext(event: any): void
  {
    console.log(event.pageX)
    // const winWidth = this.submenu.nativeElement.offsetWidth;
    // const winHeight = this.submenu.nativeElement.offsetHeight;

    // if (event.clientX + winWidth > window.innerWidth) {
    //   this.offsetX = event.pageX - winWidth;
    // } else {
    //   this.offsetX = event.pageX;
    // }

    // if (event.clientY + winHeight > window.innerHeight) {
    //   this.offsetY = event.pageY - winHeight;
    // } else {
    //   this.offsetY = event.pageY;
    // }

    // const component = this.componentFactory.resolveComponentFactory(REPWindowComponent);
    // const compRef = this.viewContainer.createComponent(component);
    // compRef.instance.uniqueID = this.uniqueID;
    // compRef.instance.subMenu = this.menu;
  }

  @Input('repContext')
  public menu: Array<REPButton>;

  @Input('repUniqueID')
  public uniqueID: number;
}
