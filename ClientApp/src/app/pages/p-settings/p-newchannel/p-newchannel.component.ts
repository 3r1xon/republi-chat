import { Component, OnInit } from '@angular/core';
import { Channel } from 'src/interfaces/channel.interface';
import { MessagesService } from 'src/services/messages.service';

@Component({
  templateUrl: './p-newchannel.component.html',
  styleUrls: ['./p-newchannel.component.scss']
})
export class PNewChannelComponent implements OnInit {

  constructor(
    private _msService: MessagesService
  ) { }

  ngOnInit(): void {
  }

  public channel: Channel = {
    name: '',
    picture: null,
  };

  async save() {
    const res = await this._msService.createChannel(this.channel).toPromise();

    console.log(res);
  }

  async onChange(event) {

    this.channel.picture = <File>event[0];

    // const file = <File>event[0];

    // const fd = new FormData();
    // fd.append("image", file, file.name);
  }


}
