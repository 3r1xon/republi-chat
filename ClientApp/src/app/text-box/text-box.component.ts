import { Component, OnInit } from '@angular/core';
import { MessagesService } from 'src/services/messages.service';

@Component({
  selector: 'text-box',
  templateUrl: './text-box.component.html',
  styleUrls: ['./text-box.component.scss']
})
export class TextBoxComponent implements OnInit {

  constructor(private _msService: MessagesService) { }

  ngOnInit(): void {
  }

  public message: string = "";

  public sendMessage() {

    if (this.message == "") return;

    this._msService.sendMessage(this.message);

    this.message = "";
    
  }

}
