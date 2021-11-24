import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { database } from 'src/environments/database';
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


  async onChange(event) {
    const file = <File>event[0];

    const fd = new FormData();
    fd.append("image", file, file.name);
    
    const res = await this.http.post<ServerResponse>(
      `${database.BASE_URL}/editProfile/${this._user.currentUser.id}`, 
      fd
      ).toPromise();
    
    if (res.success) {
      this._user.currentUser.profilePicture = res.data;
    }
  }

}
