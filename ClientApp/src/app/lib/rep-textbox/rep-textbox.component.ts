import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'rep-textbox',
  templateUrl: './rep-textbox.component.html',
  styleUrls: ['./rep-textbox.component.scss']
})
export class REPTextBoxComponent {

  constructor(
    private fb: FormBuilder
  ) { }

  @Input() 
  public enabled: boolean = true;

  @Output()
  public sendMessage = new EventEmitter<string>();

  @Output()
  public upload = new EventEmitter();

  @Input() 
  public msgMaxLength: number;

  public trigger: boolean = false;

  public form: FormGroup = this.fb.group({
    text: ['',
      [
        Validators.max(2000),
      ]
    ]
  });

  public async send(event) {

    if (this.form.valid) {
      const txt = this.form.value["text"].trim();
      this.sendMessage.emit(txt);
      this.form.reset();
      this.trigger = false;
    } else this.trigger = true;
  }

  public uploadIMG() {

    this.upload.emit("Upload");
  }
}