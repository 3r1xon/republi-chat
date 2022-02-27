import { Component, Input } from '@angular/core';
import { expand } from '../animations';

@Component({
  selector: 'rep-accordion',
  templateUrl: './rep-accordion.component.html',
  styleUrls: ['./rep-accordion.component.scss'],
  animations: [
    expand("200ms")
  ]
})
export class REPAccordionComponent {

  @Input()
  public open: boolean = false;

}