import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { database } from 'src/environments/database';
import { Account } from 'src/interfaces/account.interface';
import { ServerResponse } from 'src/interfaces/response.interface';
import { FileUploadService } from 'src/services/file-upload.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private _user: UserService,
    private _fileUpload: FileUploadService,
    private router: Router,
    private http: HttpClient
    ) { }

  ngOnInit(): void {
    this.particleNumber = Array(30).fill(0);
  }

  public particleNumber: Array<any> = []; 

  public userName: string = "";
  public password: string = "";

  public alert: string = "";

  async logIn() {
    this.http.post<ServerResponse>(`${database.BASE_URL}/authentication/logIn`, {
      userName: this.userName,
      password: this.password
    })
      .subscribe(async (response) => {
        this._user.currentUser = <Account>response.data.user;
        this._user.currentUser.profilePicture = this._fileUpload.sanitizeIMG(this._user.currentUser.profilePicture);
        this._user.userAuth = true;
        await this.router.navigate(['mainpage']);
      }, 
      (response) => {
        this.alert = response.error.message;
      });
  }
}