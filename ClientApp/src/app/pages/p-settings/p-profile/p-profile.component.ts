import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { server } from 'src/environments/server';
import { Account } from 'src/interfaces/account.interface';
import { Message } from 'src/interfaces/message.interface';
import { ServerResponse } from 'src/interfaces/response.interface';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { FileUploadService } from 'src/services/file-upload.service';
import { UserService } from 'src/services/user.service';
import { UtilsService } from 'src/services/utils.service';
import { first } from 'rxjs/operators';

@Component({
  templateUrl: './p-profile.component.html',
  styleUrls: ['./p-profile.component.scss']
})
export class PProfileComponent {

  constructor(
    public _user: UserService,
    public _fileUpload: FileUploadService,
    private _utils: UtilsService,
    private http: HttpClient,
    private router: Router
  ) {
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

  public exampleMsgOptions: Array<REPButton> = [
    {
      name: "Example",
      icon: "info_outline",
      visible: () => true,
      enabled: () => true,
      onClick: () => {

        const messages = [
          "Hey, how are you doing?",
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          "I'm waiting, waiting, waiting, sittin' up, waiting, waiting, waiting, contemplating, my heart racing.",
          "Help me make the most of freedom and of pleasure, nothing ever lasts forever..."
        ];

        let i = messages.findIndex(msg => msg == this.exampleMsg.message);
        i++;
        i == messages.length ? i = 0 : i = i;
        this.exampleMsg.message = messages[i];
      }
    }
  ];
  
  public readonly topbarActions: Array<REPButton> = [
    {
      name: "Save",
      icon: "save",
      visible: () => true,
      enabled: () => false,
      background: "success",
      onClick: () => { this.save() }
    }
  ];

  public readonly strictActions: Array<REPButton> = [
    {
      name: "Delete profile",
      icon: "dangerous",
      background: "danger",
      outline: true,
      visible: () => true,
      enabled: () => true,
      onClick: () => { this.deleteProfile() }
    }
  ];

  private file;

  async onChange(event) {

    this.file = <File>event[0];

    const file = <File>event[0];

    const fd = new FormData();
    fd.append("image", file, file.name);
    
    const res = await this.http.put<ServerResponse>(
    `${server.BASE_URL}/authentication/editProfile`, 
    fd
    ).toPromise();
    
    if (res.success) {
      this._user.currentUser.picture = this._fileUpload.sanitizeIMG(res.data);
    }
  }

  save() {

    // let fd;
    // if (this.file) {
    //   fd = new FormData();
    //   fd.append("image", this.file, this.file.name);
    // } else {
    //   this.user.picture = null;
    // }

    // this.http.put<ServerResponse>(
    // `${server.BASE_URL}/authentication/editProfile`, {
    //   body: {
    //     fd,
    //     user: this.user
    //   }
    // })
    //   .pipe(first())
    //   .subscribe();
  }

  deleteProfile() {

    this._utils.showRequest(
      "Are you sure you want to continue?",
      `By doing so your account will be deleted along with all your messages and other data. This action is permanent since RepubliChat will NOT keep the remaining data. If you change your mind you will be able to create a new account with the same email.`,
      () => {
        this._user.deleteProfile()
          .pipe(first())
          .subscribe(
            (res) => {
              if (res.success) 
                this.router.navigate(['login']);
            }
          );

      });
  }

}
