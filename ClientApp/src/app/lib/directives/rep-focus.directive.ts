import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[repFocus]'
})
export class REPFocus {

  constructor(
    private elRef: ElementRef
  ) { }

  ngAfterViewInit(){
    if (this.enabled) {
      Promise.resolve().then(() => {
        this.elRef.nativeElement.focus();
      });
    }
  }

  @Input('repFocusEnabled')
  public enabled: boolean = true;
}
