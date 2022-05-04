import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { expand } from '../rep-animations';

@Component({
  selector: 'rep-accordion',
  templateUrl: './rep-accordion.component.html',
  styleUrls: ['./rep-accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'button'
  },
  animations: [
    expand("200ms")
  ]
})
export class REPAccordionComponent {

  @Input()
  public open: boolean = false;

  @Output()
  public onExpand: EventEmitter<boolean> = new EventEmitter();

}
