import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Channel } from 'src/interfaces/channel.interface';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { MessagesService } from 'src/services/messages.service';

@Component({
  templateUrl: './p-newchannel.component.html',
  styleUrls: ['./p-newchannel.component.scss']
})
export class PNewChannelComponent implements OnInit {

  constructor(
    private _msService: MessagesService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  public channel: Channel = {
    name: '',
    picture: null,
  };

  
  public formCreation: FormGroup = this.fb.group({
    channelName: ['', // Default value
      [Validators.required, Validators.maxLength(30)]
    ]
  });

  public readonly newChannelActions: Array<REPButton> = [
    {
      name: "Create channel",
      icon: "save",
      enabled: () => this.formCreation.valid,
      background: "#46a35e",
      onClick: () => { this.save() }
    }
  ];

  public readonly existingChannelActions: Array<REPButton> = [
    {
      name: "Add channel",
      icon: "add",
      enabled: false,
      background: "#46a35e",
      onClick: () => { }
    }
  ];

  async save() {
    console.log(this.formCreation.valid);
    // const res = await this._msService.createChannel(this.channel).toPromise();

  }

  async onChange(event) {

    this.channel.picture = <File>event[0];

    // const file = <File>event[0];

    // const fd = new FormData();
    // fd.append("image", file, file.name);
  }


}
