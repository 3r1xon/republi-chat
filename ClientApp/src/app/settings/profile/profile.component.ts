import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { database } from 'src/environments/database';
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
    private http: HttpClient
  ) { }

  ngOnInit(): void {
  }


  onChange(event) {
    const file = <File>event[0];

    const fd = new FormData();
    fd.append("image", file, file.name);

    const res = this.http.post(`${database.BASE_URL}/editProfile`, fd).toPromise();

    // let reader = new FileReader();
    // reader.readAsDataURL(fileToUpload);

    // reader.onload = () => {
    //   this._user.currentUser.profilePicture = reader.result;
    // };

    // const formData = new FormData();

    // formData.append("file", fileToUpload, fileToUpload.name);

    // const res = this.http.post(`${database.BASE_URL}/editProfile`, fileToUpload).toPromise();

  }

}
