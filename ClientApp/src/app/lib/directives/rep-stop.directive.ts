import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[repStop]'
})
export class REPStopDirective {

  @HostListener("click", ["$event"])
  public onClick(event: any): void
  {
    event.stopPropagation();
  }
}
