import { 
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'rep-tooltip',
  templateUrl: './rep-tooltip.component.html',
  styleUrls: ['./rep-tooltip.component.scss'],
})
export class REPTooltipComponent implements AfterViewInit {

  constructor(private cd: ChangeDetectorRef) { }

  @ViewChild('tooltip')
  private tooltip: ElementRef;

  public marginLeft: number = 0;
  public marginRight: number = 0;

  ngAfterViewInit(): void {

    const tooltipWidth = this.tooltip.nativeElement.offsetWidth;
    const tooltipHeight = this.tooltip.nativeElement.offsetWidth;

    const { x, y } = this.tooltip.nativeElement.getBoundingClientRect();

    if (x + tooltipWidth > window.innerWidth) {
      this.marginLeft = x - window.innerWidth - tooltipWidth;
    }

    this.cd.detectChanges();
  }

}
