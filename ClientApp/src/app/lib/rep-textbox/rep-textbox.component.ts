import { Component, OnInit } from '@angular/core';
import { MessagesService } from 'src/services/messages.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'rep-textbox',
  templateUrl: './rep-textbox.component.html',
  styleUrls: ['./rep-textbox.component.scss', './rep-textbox.component.media.scss']
})
export class REPTextBoxComponent implements OnInit {

  constructor(
    private _msService: MessagesService,
    public _user: UserService,
    ) { }

  ngOnInit(): void {
  }

  public message: string = "";

  public async sendMessage() {

    if (this.message == "") return;

    await this._msService.sendMessage(this.message);

    this.message = "";
  }
}
