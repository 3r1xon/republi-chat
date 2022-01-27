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

  public form: FormGroup = this.fb.group({
    text: ['',
      [
        Validators.max(2000),
        Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)
      ]
    ]
  });

  public async send(event) {
    if (!this.enabled) return;

    if (this.form.valid) {
      this.sendMessage.emit(this.form.value["text"]);
      this.form.reset();
    };
  }

  public uploadIMG() {
    if (!this.enabled) return;

    this.upload.emit("Upload");
  }
}