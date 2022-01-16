import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'rep-textbox',
  templateUrl: './rep-textbox.component.html',
  styleUrls: ['./rep-textbox.component.scss']
})
export class REPTextBoxComponent {

  constructor(
  ) { }

  @Input() 
  public enabled: boolean = true;

  @Output()
  public sendMessage = new EventEmitter<string>();

  @Output()
  public upload = new EventEmitter();

  public message: string = "";

  public async send() {

    if (!this.enabled) return;

    if (this.message == "") return;

    this.sendMessage.emit(this.message);

    this.message = "";
  }

  public uploadIMG() {

    if (!this.enabled) return;

    this.upload.emit("Upload");
  }
}