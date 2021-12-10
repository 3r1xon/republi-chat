import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[stopPropagation]'
})
export class StopPropagationDirective {

  constructor() { }

  @HostListener("click", ["$event"])
  public onClick(event: any): void
  {
    event.stopPropagation();
  }
}
