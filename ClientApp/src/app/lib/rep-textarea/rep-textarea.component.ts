import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'rep-textarea',
  templateUrl: './rep-textarea.component.html',
  styleUrls: ['./rep-textarea.component.scss']
})
export class REPTextareaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input()
  public enabled: boolean = true;

  @Input()
  public text: string = '';

  @Input()
  public placeholder: string = '';

  @Output()
  public send = new EventEmitter();

  @Output()
  public textChange = new EventEmitter<string>();

  submitHandler() {
    this.send.emit(this.text);
  }

  onChange() {
    this.textChange.emit(this.text);
  }

}
