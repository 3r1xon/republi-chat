import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UserStatus } from 'src/interfaces/account.interface';

@Component({
  selector: 'rep-profile-pic',
  templateUrl: './rep-profile-pic.component.html',
  styleUrls: ['./rep-profile-pic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class REPProfilePicComponent {

  @Input()
  public letter: string;

  @Input()
  public src: string;

  @Input()
  public width: string = "45px";

  @Input()
  public height: string = "45px";

  private _color: string = "royalblue";

  @Input()
  public set color(cl: string) {
    cl ??= "royalblue";
    this._color = cl;
  }

  @Input()
  public status: UserStatus;

  public statuses = UserStatus;

  public get color() {
    return this._color;
  }
}
