import {
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
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

  public onEvent(event: any): void
  {
    if (!this.enabled) return;

    const selectedText = window.getSelection().toString();

    if (selectedText) return;

    // TODO: Test this line
    event.preventDefault();

    const component = this.componentFactory.resolveComponentFactory(REPWindowComponent);
    const compRef = this.viewContainer.createComponent(component);

    compRef.instance.uniqueID = this.uniqueID;
    compRef.instance.subMenu = this.menu;

    this.repState.emit(true);

    this.renderer.setStyle(
      compRef.location.nativeElement,
      "position",
      "fixed"
    );

    this.renderer.setStyle(
      compRef.location.nativeElement,
      "z-index",
      "999"
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

    this.renderer.setAttribute(
      this.elRef.nativeElement,
      "style",
      "background: #9595951a !important"
    );

    setTimeout(() => {

      const eventNames = ["click", "contextmenu"];

      eventNames.forEach((eName) => {
        const unsub = this.renderer.listen(document, eName, (e) => {

          compRef.destroy();

          this.repState.emit(false);

          unsub();

          if (this.elRef.nativeElement.contains(e.target))
            return;

          this.renderer.setStyle(
            this.elRef.nativeElement,
            "background",
            null
          );

        });

      });

      const resize = this.renderer.listen("window", "resize", () => {
        compRef.destroy();

        this.repState.emit(false);

        resize();

        this.renderer.setStyle(
          this.elRef.nativeElement,
          "background",
          null
        );
      });
    });
  }

  @Input('repContext')
  public menu: Array<REPButton>;

  @Input('repUniqueID')
  public uniqueID: number;

  @Input('repMode')
  public mode: string = "contextmenu" || "click";

  @Input('repEnabled')
  public enabled: boolean = true;

  @Output()
  public repState: EventEmitter<boolean> = new EventEmitter();
}
