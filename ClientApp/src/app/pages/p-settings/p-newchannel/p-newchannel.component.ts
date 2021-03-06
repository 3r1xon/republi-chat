import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Channel } from 'src/interfaces/channel.interface';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { ServerResponse } from 'src/interfaces/response.interface';
import { MessagesService } from 'src/services/messages.service';
import { UtilsService } from 'src/services/utils.service';

@Component({
  templateUrl: './p-newchannel.component.html',
  styleUrls: ['./p-newchannel.component.scss']
})
export class PNewChannelComponent {

  constructor(
    private _ms: MessagesService,
    private _utils: UtilsService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  public formCreation: FormGroup = this.fb.group({
    picture: [null,
      [

      ]
    ],
    channelName: ['',
      [
        Validators.minLength(3),
        Validators.maxLength(30)
      ]
    ],
  });

  public formAdd: FormGroup = this.fb.group({
    channelName: ['',
      [
        Validators.required,
        Validators.maxLength(30)
      ]
    ],
    channelCode: ['0001',
      [
        Validators.required,
        Validators.maxLength(4),
        Validators.minLength(4)
      ]
    ]
  });

  public readonly newChannelActions: Array<REPButton> = [
    {
      name: "Create",
      icon: "save",
      type: "submit",
      enabled: () => this.formCreation.valid,
      background: "success",
      onClick: () => { this.createChannel(); }
    }
  ];

  public readonly existingChannelActions: Array<REPButton> = [
    {
      name: "Add",
      icon: "add",
      enabled: () => this.formAdd.valid,
      type: "submit",
      background: "success",
      onClick: () => { this.addChannel(); }
    }
  ];

  async createChannel() {

    const channel: Channel = {
      name: this.formCreation.value.channelName,
      picture: this.formCreation.value.picture
    };

    this._ms.API_createChannel(channel)
      .toPromise()
      .then(
        (res: ServerResponse) => {

          if (res.success) {

            this._ms.channels.push(res.data);

            this.formCreation.setValue({
              channelName: '',
              picture: null
            });

            this._utils.showRequest(
              "Channel created successfully",
              `The channel "${channel.name}" has been created successfully, you can now find it at the main page!`,
              [
                {
                  name: "Mainpage",
                  icon: "home",
                  onClick: () => {
                    this.router.navigate(['mainpage']);
                  },
                  background: "success"
                },
                {
                  name: "Close",
                  icon: "close",
                }
              ]
            );
          }
      }).catch((res: HttpErrorResponse) => {
        this._utils.showRequest("Error while creating the channel", res.error.message);
      });

  }

  async addChannel() {

    const channel: Channel = {
      name: this.formAdd.value.channelName,
      code: this.formAdd.value.channelCode
    };

    this._ms.API_addChannel(channel)
      .toPromise()
      .then(
        (res: ServerResponse) => {

          if (res.success) {

            this.formAdd.setValue({
              channelName: '',
              channelCode: ''
            });

            this._utils.showRequest(
              "Channel found, you're on the waiting list",
              `The channel "${channel.name}" has been successfully found, you now have to wait until you are accepted in!`,
              [
                {
                  name: "Mainpage",
                  icon: "home",
                  onClick: () => {
                    this.router.navigate(['mainpage']);
                  },
                  background: "success"
                },
                {
                  name: "Close",
                  icon: "close",
                }
              ]
            );
          }

        }).catch((response: HttpErrorResponse) => {
          this._utils.showRequest(
            "Error",
            response.error.message,
            [
              {
                name: "Close",
                icon: "close",
              }
            ]
          );
        });

  }

  async onChange(event) {

    // this.channel.picture = <File>event[0];

    // const file = <File>event[0];

    // const fd = new FormData();
    // fd.append("image", file, file.name);
  }
}
