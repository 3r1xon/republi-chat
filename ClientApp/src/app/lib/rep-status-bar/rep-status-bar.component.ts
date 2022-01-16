import { 
  Component, 
  HostListener, 
  Input, 
} from '@angular/core';
import { Router } from '@angular/router';
import { Account } from 'src/interfaces/account.interface';
import { UtilsService } from 'src/services/utils.service';

@Component({
  selector: 'rep-status-bar',
  templateUrl: './rep-status-bar.component.html',
  styleUrls: ['./rep-status-bar.component.scss']
})
export class REPStatusBarComponent {

  constructor(
    private _utils: UtilsService,
    private router: Router,
  ) { }

  @Input()
  public user: Account;

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent) {
    const key = event.key;
    if (key == "Escape")
      this.router.navigate(['settings']);
  }

  toggleServerGroup() {
    this._utils.showServerGroup = !this._utils.showServerGroup;
  }
}
