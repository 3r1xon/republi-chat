import { Component, Input } from '@angular/core';

@Component({
  selector: 'rep-profile-pic',
  templateUrl: './rep-profile-pic.component.html',
  styleUrls: ['./rep-profile-pic.component.scss']
})
export class REPProfilePicComponent {

  constructor() { }

  @Input()
  public letter: string = "";

  @Input()
  public src: string = "";

  public pictureError: boolean = false;
}
