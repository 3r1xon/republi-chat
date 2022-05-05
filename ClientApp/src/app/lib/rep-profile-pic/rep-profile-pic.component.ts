import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UserStatus } from 'src/interfaces/account.interface';

@Component({
  selector: 'rep-profile-pic',
  templateUrl: './rep-profile-pic.component.html',
  styleUrls: ['./rep-profile-pic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class REPProfilePicComponent implements OnInit {

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {

    if (this.src == null) return;

    const extensions = {
      "/": "jpg",
      "i": "png",
      "R": "gif",
      "U": "webp"
    };

    this.src = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/${extensions[this.src[0]]};base64,` + this.src);
  }

  @Input()
  public letter: string;

  @Input()
  public src: SafeResourceUrl;

  @Input()
  public width: string = "45px";

  @Input()
  public height: string = "45px";

  @Input()
  public background: string = "#202124";

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
