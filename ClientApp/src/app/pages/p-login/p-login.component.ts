import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { server } from 'src/environments/server';
import { Account } from 'src/interfaces/account.interface';
import { ServerResponse } from 'src/interfaces/response.interface';
import { FileUploadService } from 'src/services/file-upload.service';
import { UserService } from 'src/services/user.service';

@Component({
  templateUrl: './p-login.component.html',
  styleUrls: ['./p-login.component.scss']
})
export class PLoginComponent implements OnInit {

  constructor(
    private _user: UserService,
    private _fileUpload: FileUploadService,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder
    ) { }

  ngOnInit(): void {
    this.particles = Array(30).fill(0);
  }

  public particles: Array<any> = []; 

  public alert: string = "";

  public form: FormGroup = this.fb.group({
    userName: ['', // Default value
      [Validators.required, Validators.maxLength(30)]
    ],
    password: ['', // Default value
      [Validators.required, Validators.maxLength(30)]
    ]
  });

  async logIn() {

    if (!this.form.valid) return;

    this.http.post<ServerResponse>(`${server.BASE_URL}/authentication/logIn`, {
      userName: this.form.value.userName,
      password: this.form.value.password
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