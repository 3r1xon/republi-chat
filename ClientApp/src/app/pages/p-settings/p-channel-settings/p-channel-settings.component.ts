import { Component, OnInit } from '@angular/core';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { MessagesService } from 'src/services/messages.service';
import { UtilsService } from 'src/services/utils.service';

@Component({
  templateUrl: './p-channel-settings.component.html',
  styleUrls: ['./p-channel-settings.component.scss']
})
export class PChannelSettingsComponent implements OnInit {

  constructor(
    public _msService: MessagesService,
    private _utils: UtilsService
  ) { }

  ngOnInit(): void {
  }

  public chOptions: Array<REPButton> = [
    {
      name: "Settings",
      icon: "settings",
      onClick: () => {}
    },
    {
      name: "Leave",
      icon: "delete",
      color: "danger",
      onClick: () => {
        this._utils.showRequest(
          "Are you sure you want to leave this channel?",
          "By doing so you'll leave the channel and all your messages will be deleted!",
          () => {

          }
        );
      }
    }
  ];


}
