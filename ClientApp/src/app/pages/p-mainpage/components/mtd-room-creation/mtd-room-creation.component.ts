import { HttpClient } from '@angular/common/http';
import { Component, Host, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { REPManager } from 'src/app/lib/rep-manager';
import { environment } from 'src/environments/environment';
import { MessagesService } from 'src/services/messages.service';
import { PMainpageComponent } from '../../p-mainpage.component';

@Component({
  selector: 'mtd-room-creation',
  templateUrl: './mtd-room-creation.component.html',
  styleUrls: ['./mtd-room-creation.component.scss']
})
export class MTDRoomCreationComponent extends REPManager implements OnInit {

  constructor(
    public http: HttpClient,
    @Host() public mainpage: PMainpageComponent,
    private _ms: MessagesService,
    private fb: FormBuilder,
  ) {
    super(http);
  }

  ngOnInit(): void {

    this.setValues(this.form);

    this.setSaveAPI("POST", `${environment.BASE_URL}/channels/addChRoom`);

  }

  save(): Promise<any> {
    this.setDirty("id");
    this.setDirty("textRoom");
    this.setDirty("autoJoin");
    this.setDirty("channelMemberID");

    return super.save().finally(() => {
      this.mainpage.roomCreation = false;
    });
  }

  public form: FormGroup = this.fb.group({
    id: [this._ms.currentChannel.id],
    channelMemberID: [this._ms.chPermissions.id],
    textRoom: [true],
    roomName: ['',
      [
        Validators.maxLength(30),
        Validators.minLength(1),
        // No more than one white space allowed before each word
        Validators.pattern(/^([a-zA-Z0-9]+\s)*[a-zA-Z0-9]+$/)
      ]
    ],
    autoJoin: [true,
      [
        Validators.required
      ]
    ],
  });

}
