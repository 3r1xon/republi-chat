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

  @Input()
  public rows: number = 20;

  @Input()
  public cols: number = 50;

  @Input()
  public background: string = "#95959536";

  @Output()
  public send = new EventEmitter();

  @Output()
  public textChange = new EventEmitter<string>();

  submitHandler(event: any) {
    event.preventDefault();
    this.send.emit(this.text);
  }

  onChange() {
    this.textChange.emit(this.text);
  }

}
