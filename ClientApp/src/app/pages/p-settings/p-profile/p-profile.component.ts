import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Account } from 'src/interfaces/account.interface';
import { Message } from 'src/interfaces/message.interface';
import { ServerResponse } from 'src/interfaces/response.interface';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { FileUploadService } from 'src/services/file-upload.service';
import { UserService } from 'src/services/user.service';
import { UtilsService } from 'src/services/utils.service';
import { environment } from 'src/environments/environment';
import { REPManager } from 'src/app/lib/manager';

@Component({
  templateUrl: './p-profile.component.html',
  styleUrls: ['./p-profile.component.scss']
})
export class PProfileComponent extends REPManager implements OnInit {

  constructor(
    public _user: UserService,
    public _fileUpload: FileUploadService,
    private _utils: UtilsService,
    public http: HttpClient
  ) {
    super(http);
  }

  ngOnInit(): void {
    this.setValues(this.user);

    this.setSaveAPI("PUT", `${environment.BASE_URL}/authentication/editProfile`);
  }

  public user: Account = { ...this._user.currentUser };

  public editName: boolean = false;

  public editEmail: boolean = false;

  public exampleMsg: Message = {
    name: this.user.name,
    message: "Hey, how are you doing?",
    color: this.user.color,
    backgroundColor: this.user.backgroundColor,
    picture: this.user.picture,
    date: new Date(),
    auth: false
  };

  public readonly topbarActions: Array<REPButton> = [
    {
      name: "Save",
      icon: "save",
      enabled: () => this.isAnyDirty(),
      background: "success",
      onClick: () => { this.save(); }
    }
  ];

  public readonly strictActions: Array<REPButton> = [
    {
      name: "Delete profile",
      icon: "dangerous",
      tooltip: "Delete all your data",
      background: "danger",
      outline: true,
      onClick: () => { this.deleteProfile(); }
    }
  ];

  private file;

  async onChange(event) {

    this.file = <File>event[0];

    const file = <File>event[0];

    const fd = new FormData();
    fd.append("image", file, file.name);

    const res = await this.http.put<ServerResponse>(
    `${environment.BASE_URL}/authentication/editProfile`,
    fd
    ).toPromise();

    if (res.success) {
      this._user.currentUser.picture = this._fileUpload.sanitizeIMG(res.data);
    }
  }

  deleteProfile() {

    this._utils.showRequest(
      "Are you sure you want to continue?",
      `By doing so your account will be deleted. This action is permanent since RepubliChat will NOT keep the remaining data. If you change your mind you'll be able to create a new account with the same email.`,
      () => {
        this._user.API_deleteProfile()
          .toPromise()
          .then(
            (res) => {
              if (res.success)
                this._user.logOut();
            }
          );

      });
  }

}
