import { ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'mtd-footer',
  templateUrl: './mtd-footer.component.html',
  styleUrls: ['./mtd-footer.component.scss']
})
export class MTDFooterComponent {

  constructor(private cd: ChangeDetectorRef) {
    this.cd.detach();
  }

}
