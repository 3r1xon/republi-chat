import { Component, OnInit } from '@angular/core';
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
    // private file: File
  ) { }

  ngOnInit(): void {
  }

  onChange(event) {
    // this.file = event.target.files[0];
  }

}
