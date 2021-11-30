import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { database } from 'src/environments/database';
import { Account } from 'src/interfaces/account.interface';
import { ServerResponse } from 'src/interfaces/response.interface';
import { FileUploadService } from 'src/services/file-upload.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(
    public _user: UserService,
    public _fileUpload: FileUploadService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
  }

  public user: Account = { ...this._user.currentUser };

  public editName: boolean = false;

  private file;

  async onChange(event) {

    this.file = <File>event[0];

    const file = <File>event[0];

    const fd = new FormData();
    fd.append("image", file, file.name);
    
    const res = await this.http.post<ServerResponse>(
    `${database.BASE_URL}/authentication/editProfile`, 
    fd
    ).toPromise();
    
    if (res.success) {
      this._user.currentUser.profilePicture = this._fileUpload.sanitizeIMG(res.data);
    }
  }

  async save() {

    // let fd;
    // if (this.file) {
    //   fd = new FormData();
    //   fd.append("image", this.file, this.file.name);
    // } else {
    //   this.user.profilePicture = null;
    // }

    // const res = await this.http.post<ServerResponse>(
    // `${database.BASE_URL}/authentication/editProfile`, {
    //   body: {
    //     fd,
    //     user: this.user
    //   }
    // }
    // ).toPromise();

  }

}
