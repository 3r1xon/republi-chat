import {
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  Input,
  NgZone,
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
    private renderer: Renderer2,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.renderer.listen(this.elRef.nativeElement, this.mode, (event) => {
      this.onEvent(event);
    });
  }

  public onEvent(event: any): void
  {
    // TODO: Test this line
    event.preventDefault();

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
      "1"
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

    const closeWindow = () => {
      compRef.destroy();

      this.renderer.setStyle(
        this.elRef.nativeElement,
        "background",
        null
      );
    };

    setTimeout(() => {

      const clickReg = this.renderer.listen(document, "click", () => {
        closeWindow();
        clickReg();
      });

      const contextReg = this.renderer.listen(document, "contextmenu", () => {
        closeWindow();
        contextReg();
      });
    });
    // this.ngZone.runOutsideAngular(() => {
    // });
  }

  @Input('repContext')
  public menu: Array<REPButton>;

  @Input('repUniqueID')
  public uniqueID: number;

  @Input('repMode')
  public mode: string = "contextmenu" || "click";
}
