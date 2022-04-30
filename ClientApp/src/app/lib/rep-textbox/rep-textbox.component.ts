import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { REPTextareaComponent } from '../rep-textarea/rep-textarea.component';

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

  @Input()
  public msgMaxLength: number;

  @Input()
  public spamProtectionFor: number = 1500;

  @Output()
  public sendMessage = new EventEmitter<string>();

  @Output()
  public upload = new EventEmitter();

  @ViewChild(REPTextareaComponent) REPTextArea: REPTextareaComponent;

  public trigger: boolean = false;

  public showSpamProtection: boolean = false;

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

  private lastInsertionDate: number;

  public send(event) {
    if (this.form.valid && this.enabled) {

      const diff = new Date().getTime() - this.lastInsertionDate;

      if (diff < this.spamProtectionFor) {

        if (this.showSpamProtection) return;

        this.showSpamProtection = true;

        setTimeout(() => {
          this.showSpamProtection = false;
        }, diff);

        return;
      }

      const txt = this.form.value["text"].trim();

      this.historyIndex = null;

      this.addToHistory(this.form.value["text"]);

      this.sendMessage.emit(txt);

      this.form.reset();

      this.trigger = false;

      this.lastInsertionDate = new Date().getTime();

      this.showSpamProtection = false;

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

      setTimeout(() => {
        this.REPTextArea.setCaretPosition(this.form.value["text"].length);
      });
    }
  }

  setNextText() {
    if (this.textHistory.length == 0 || this.historyIndex == null)
      return;

    if (this.textHistory[this.historyIndex + 1] != null)
      this.historyIndex++;

    if (this.form.value["text"] != null && this.form.value["text"] != "")
      this.addToHistory(this.form.value["text"]);

    this.setTextValue(this.textHistory[this.historyIndex]);

    setTimeout(() => {
      this.REPTextArea.setCaretPosition(this.form.value["text"].length);
    });
  }
}
