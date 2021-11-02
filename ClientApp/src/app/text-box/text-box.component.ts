import { Component, OnInit } from '@angular/core';
import { MessagesService } from 'src/services/messages.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'text-box',
  templateUrl: './text-box.component.html',
  styleUrls: ['./text-box.component.scss']
})
export class TextBoxComponent implements OnInit {

  constructor(
    private _msService: MessagesService,
    public _user: UserService,
    ) { }

  ngOnInit(): void {
  }

  public message: string = "";

  public async sendMessage() {

    if (this.message == "") return;

    this._msService.sendMessage(this.message);

    this.message = "";
    
  }

}
