import { Directive, HostListener, Input } from '@angular/core';
import { REPButton } from 'src/interfaces/repbutton.interface';

@Directive({
  selector: '[repContext]',
})
export class REPContextDirective {

  @HostListener("contextmenu", ["$event"])
  public onContext(event: any): void
  {
    console.log(this.menu);
  }

  @Input('repContext')
  public menu: Array<REPButton>;

}
