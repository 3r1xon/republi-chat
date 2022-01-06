import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { Router } from '@angular/router';
import { Account } from 'src/interfaces/account.interface';

@Component({
  selector: 'rep-textbox',
  templateUrl: './rep-textbox.component.html',
  styleUrls: ['./rep-textbox.component.scss', './rep-textbox.component.media.scss']
})
export class REPTextBoxComponent implements OnInit {

  constructor(
    private router: Router
    ) { }

  ngOnInit(): void {
  }
  
  @Input()
  public user: Account;

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

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent) {
    const key = event.key;
    if (key == "Escape")
      this.router.navigate(['settings']);
  }
}