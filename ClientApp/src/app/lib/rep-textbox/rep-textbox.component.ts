import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'rep-textbox',
  templateUrl: './rep-textbox.component.html',
  styleUrls: ['./rep-textbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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

  public setTextValue(txt: string) {
    this.form.setValue({ text: txt });
  }

  public form: FormGroup = this.fb.group({
    text: ['',
      [
        Validators.required,
        Validators.max(2000),
      ]
    ]
  });

  public send(event) {
    if (this.form.valid && this.enabled) {
      const txt = this.form.value["text"].trim();
      this.addToHistory(this.form.value["text"]);
      this.historyIndex = this.textHistory.length;
      this.sendMessage.emit(txt);
      this.form.reset();
      this.trigger = false;
    } else this.trigger = true;
  }

  public uploadIMG() {

    this.upload.emit("Upload");
  }

  private textHistory: Array<string> = [];

  private historyIndex: number;

  addToHistory(text: string) {
    if (this.textHistory.some(txt => txt == text))
      return;

    this.textHistory.push(text);
  }

  setPreviousText() {
    if (this.textHistory.length == 0)
      return;

    if (this.historyIndex == null)
      this.historyIndex = this.textHistory.length - 1;
    else if (!(this.historyIndex - 1 < 0)) {
      this.historyIndex--;
    }

    if (this.textHistory[this.historyIndex]) {
      if (this.form.value["text"] != null && this.form.value["text"] != "")
        this.addToHistory(this.form.value["text"]);

      this.setTextValue(this.textHistory[this.historyIndex]);
    }
  }

  setNextText() {
    if (this.textHistory.length == 0 || this.historyIndex == null)
      return;

    if (this.historyIndex + 1 != this.textHistory.length)
      this.historyIndex++;

    if (this.form.value["text"] != null && this.form.value["text"] != "")
      this.addToHistory(this.form.value["text"]);

    this.setTextValue(this.textHistory[this.historyIndex]);
  }
}
