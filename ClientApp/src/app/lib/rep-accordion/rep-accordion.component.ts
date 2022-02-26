import { Component, EventEmitter, Input, Output } from '@angular/core';
import { expand } from '../animations';

@Component({
  selector: 'rep-accordion',
  templateUrl: './rep-accordion.component.html',
  styleUrls: ['./rep-accordion.component.scss'],
  animations: [
    expand("150ms")
  ]
})
export class REPAccordionComponent {

  @Input()
  public open: boolean = false;

  @Output()
  public openChange: EventEmitter<boolean> = new EventEmitter();

}