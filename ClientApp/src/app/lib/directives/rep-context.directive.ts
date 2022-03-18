import {
  ComponentFactoryResolver,
  Directive,
  ElementRef,
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
    private elRef: ElementRef,
    private viewContainer: ViewContainerRef,
    private componentFactory: ComponentFactoryResolver,
  ) { }

  private static instances: Array<ViewContainerRef> = [];

  @HostListener("contextmenu", ["$event"])
  public onContext(event: any): void
  {
    event.preventDefault();

    this.closeAllWindows();

    const component = this.componentFactory.resolveComponentFactory(REPWindowComponent);
    const compRef = this.viewContainer.createComponent(component);

    compRef.instance.uniqueID = this.uniqueID;
    compRef.instance.subMenu = this.menu;

    compRef.location.nativeElement.style.position = "fixed";
    compRef.location.nativeElement.style.zIndex = "1";

    const winWidth = compRef.location.nativeElement.style.width;
    const winHeight = compRef.location.nativeElement.style.height;

    if (event.clientX + winWidth > window.innerWidth) {
      compRef.location.nativeElement.style.left = `${event.pageX - winWidth}px`;
    } else {
      compRef.location.nativeElement.style.left = `${event.pageX}px`;
    }

    if (event.clientY + winHeight > window.innerHeight) {
      compRef.location.nativeElement.style.top = `${event.pageY - winHeight}px`;
    } else {
      compRef.location.nativeElement.style.top = `${event.pageY}px`;
    }

    this.elRef.nativeElement.style.background = "#9595951a";

    REPContextDirective.instances.push(this.viewContainer);
  }

  @Input('repContext')
  public menu: Array<REPButton>;

  @Input('repUniqueID')
  public uniqueID: number;

  @HostListener('window:resize', ['$event'])
  @HostListener('document:click', ['$event'])
  closeAllWindows() {

    if (REPContextDirective.instances.length > 0) {

      REPContextDirective.instances
        .forEach((instance) => {
          instance.clear();
          instance.element.nativeElement.style.background = null;
        });

      REPContextDirective.instances = [];
    }

  }
}
