import {
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  ViewContainerRef
} from '@angular/core';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { REPWindowComponent } from '../rep-window/rep-window.component';

@Directive({
  selector: '[repContext]',
})
export class REPContextDirective implements OnInit {

  constructor(
    private elRef: ElementRef,
    private viewContainer: ViewContainerRef,
    private componentFactory: ComponentFactoryResolver,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.renderer.listen(this.elRef.nativeElement, this.mode, (event) => {
      this.onEvent(event);
    });
  }

  private static instances: Array<ViewContainerRef> = [];

  public onEvent(event: any): void
  {
    // TODO: Test this line
    event.preventDefault();

    this.closeAllWindows();

    const component = this.componentFactory.resolveComponentFactory(REPWindowComponent);
    const compRef = this.viewContainer.createComponent(component);

    compRef.instance.uniqueID = this.uniqueID;
    compRef.instance.subMenu = this.menu;

    this.renderer.setStyle(
      compRef.location.nativeElement,
      "position",
      "fixed"
    );

    this.renderer.setStyle(
      compRef.location.nativeElement,
      "z-index",
      `${REPContextDirective.instances.length + 1}`
    );

    compRef.changeDetectorRef.detectChanges();

    const { offsetWidth, offsetHeight } = compRef.location.nativeElement;

    this.renderer.setStyle(
      compRef.location.nativeElement,
      "left",
      event.clientX + offsetWidth > window.innerWidth ?
        `${event.pageX - offsetWidth}px`
      :
        `${event.pageX}px`
    );

    this.renderer.setStyle(
      compRef.location.nativeElement,
      "top",
      event.clientY + offsetHeight > window.innerHeight ?
        `${event.pageY - offsetHeight}px`
      :
        `${event.pageY}px`
    );

    this.renderer.setStyle(
      this.elRef.nativeElement,
      "background",
      "#9595951a"
    );

    REPContextDirective.instances.push(this.viewContainer);
  }

  @Input('repContext')
  public menu: Array<REPButton>;

  @Input('repUniqueID')
  public uniqueID: number;

  @Input('repMode')
  public mode: string = "contextmenu" || "click";

  @HostListener('window:resize', ['$event'])
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
