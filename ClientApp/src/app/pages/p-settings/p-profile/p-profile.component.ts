import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { database } from 'src/environments/database';
import { Account } from 'src/interfaces/account.interface';
import { Message } from 'src/interfaces/message.interface';
import { ServerResponse } from 'src/interfaces/response.interface';
import { SubMenu } from 'src/interfaces/submenu.interface';
import { FileUploadService } from 'src/services/file-upload.service';
import { UserService } from 'src/services/user.service';

@Component({
  templateUrl: './p-profile.component.html',
  styleUrls: ['./p-profile.component.scss']
})
export class PProfileComponent implements OnInit {

  constructor(
    public _user: UserService,
    public _fileUpload: FileUploadService,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  public user: Account = { ...this._user.currentUser };

  public editName: boolean = false;

  public editEmail: boolean = false;

  public exampleMsg: Message = {
    name: this.user.name,
    userMessage: "Hey, how are you doing?",
    userColor: this.user.userColor,
    userImage: this.user.profilePicture,
    date: new Date(),
    auth: false
  };

  exampleMsgOptions: Array<SubMenu> = [
    {
      name: "Example",
      icon: "info_outline",
      onClick: () => {

        const messages = [
          "Hey, how are you doing?",
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          "I'm waiting, waiting, waiting, sittin' up, waiting, waiting, waiting, contemplating, my heart racing.",
          "Help me make the most of freedom and of pleasure, nothing ever lasts forever..."
        ];

        let i = messages.findIndex(msg => msg == this.exampleMsg.userMessage);
        i++;
        i == messages.length ? i = 0 : i = i;
        this.exampleMsg.userMessage = messages[i];
      }
    }
  ];

  private file;

  async onChange(event) {

    this.file = <File>event[0];

    // const file = <File>event[0];

    // const fd = new FormData();
    // fd.append("image", file, file.name);
    
    // const res = await this.http.post<ServerResponse>(
    // `${database.BASE_URL}/authentication/editProfile`, 
    // fd
    // ).toPromise();
    
    // if (res.success) {
    //   this._user.currentUser.profilePicture = this._fileUpload.sanitizeIMG(res.data);
    // }
  }

  async save() {

    let fd;
    if (this.file) {
      fd = new FormData();
      fd.append("image", this.file, this.file.name);
    } else {
      this.user.profilePicture = null;
    }

    const res = await this.http.post<ServerResponse>(
    `${database.BASE_URL}/authentication/editProfile`, {
      body: {
        fd,
        user: this.user
      }
    }
    ).toPromise();

  }

  async deleteProfile() {
    const res = await this._user.deleteProfile().toPromise();

    if (res.success) {
      this.router.navigate(['login']);
    }
  }

}
