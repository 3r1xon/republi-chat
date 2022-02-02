import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Channel } from 'src/interfaces/channel.interface';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { MessagesService } from 'src/services/messages.service';
import { UtilsService } from 'src/services/utils.service';

@Component({
  templateUrl: './p-newchannel.component.html',
  styleUrls: ['./p-newchannel.component.scss']
})
export class PNewChannelComponent {

  constructor(
    private _msService: MessagesService,
    private _utils: UtilsService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  public formCreation: FormGroup = this.fb.group({
    channelImage: [null],
    channelName: ['',
      [Validators.required, Validators.maxLength(30)]
    ]
  });

  public formAdd: FormGroup = this.fb.group({
    channelName: ['',
      [Validators.required, Validators.maxLength(30)]
    ],
    channelCode: ['',
      [Validators.required, Validators.maxLength(4),  Validators.minLength(4)]
    ]
  });

  public readonly newChannelActions: Array<REPButton> = [
    {
      name: "Create channel",
      icon: "save",
      visible: () => true,
      enabled: () => this.formCreation.valid,
      background: "success",
      onClick: () => { this.createChannel(); }
    }
  ];

  public readonly existingChannelActions: Array<REPButton> = [
    {
      name: "Add channel",
      icon: "add",
      visible: () => true,
      enabled: () => this.formAdd.valid,
      background: "success",
      onClick: () => { this.addChannel(); }
    }
  ];

  async createChannel() {

    const channel: Channel = {
      name: this.formCreation.value.channelName,
      picture: null
    };

    const sub = this._msService.createChannel(channel)
      .subscribe(
        (res) => {

          if (res.success) {
      
            this.formCreation.setValue({ 
              channelName: '',
              channelImage: null
            });
      
            this._utils.showRequest(
              "Channel created successfully", 
              `The channel "${channel.name}" has been created successfully, you can now find it at the main page!`, 
              [
                {
                  name: "Mainpage",
                  icon: "home",
                  visible: () => true,
                  enabled: () => true,
                  onClick: () => {
                    this.router.navigate(['mainpage']);
                  },
                  background: "success"
                },
                {
                  name: "Close",
                  icon: "close",
                  visible: () => true,
                  enabled: () => true,
                }
              ]);
          }
        },
        () => { }, 
        () => {
          sub.unsubscribe();
        }
    );

  }

  async addChannel() {

    const channel: Channel = {
      name: this.formAdd.value.channelName,
      code: this.formAdd.value.channelCode
    };

    const sub = this._msService.addChannel(channel)
      .subscribe(
        (res) => {

          if (res.success) {
      
            this.formAdd.setValue({ 
              channelName: '',
              channelCode: ''
            });
      
            this._utils.showRequest(
              "Channel found and added", 
              `The channel "${channel.name}" has been successfully added, you can now find it at the main page!`, 
              [
                {
                  name: "Mainpage",
                  icon: "home",
                  visible: () => true,
                  enabled: () => true,
                  onClick: () => {
                    this.router.navigate(['mainpage']);
                  },
                  background: "success"
                },
                {
                  name: "Close",
                  icon: "close",
                  visible: () => true,
                  enabled: () => true,
                }
              ]);
          } else {
            this._utils.showRequest(
              "Channel not found", 
              `The channel "${channel.name}" was not found, are you sure the name and code is correct?`, 
              [
                {
                  name: "Close",
                  icon: "close",
                  visible: () => true,
                  enabled: () => true,
                }
              ]);
          }
        },
        () => { },
        () => {
          sub.unsubscribe();
        }
      );

  }

  async onChange(event) {

    // this.channel.picture = <File>event[0];

    // const file = <File>event[0];

    // const fd = new FormData();
    // fd.append("image", file, file.name);
  }
}
