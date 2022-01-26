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

  public message: string = "";

  public form: FormGroup = this.fb.group({
    text: ['',
      [
        Validators.required,
        Validators.pattern(/^\S*$/)
      ]
    ]
  });

  public async send() {

    if (!this.enabled) return;

    if (this.form.valid) {
      this.sendMessage.emit(this.message);

      this.message = "";
    };
  }

  public uploadIMG() {

    if (!this.enabled) return;

    this.upload.emit("Upload");
  }
}