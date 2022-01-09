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

  public marginLeft: string = "0px";
  public marginRight: string = "0px";

  ngAfterViewInit(): void {

    const tooltipWidth = this.tooltip.nativeElement.offsetWidth;
    const tooltipHeight = this.tooltip.nativeElement.offsetWidth;

    const { x, y } = this.tooltip.nativeElement.getBoundingClientRect();

    if (x + tooltipWidth > window.innerWidth) {
      this.marginLeft = `${x - window.innerWidth - tooltipWidth}px`;
    }

    this.cd.detectChanges();
  }

}
