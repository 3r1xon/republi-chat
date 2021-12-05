import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { database } from 'src/environments/database';
import { Account } from 'src/interfaces/account.interface';
import { ServerResponse } from 'src/interfaces/response.interface';
import { FileUploadService } from 'src/services/file-upload.service';
import { UserService } from 'src/services/user.service';

@Component({
  templateUrl: './p-login.component.html',
  styleUrls: ['./p-login.component.scss']
})
export class PLoginComponent implements OnInit, ControlValueAccessor {

  constructor(
    private _user: UserService,
    private _fileUpload: FileUploadService,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder
    ) { }

  ngOnInit(): void {
    this.particles = Array(30).fill(0);

    this.form = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  public particles: Array<any> = []; 

  public userName: string = "";

  public password: string = "";

  public alert: string = "";

  public form: FormGroup;

  writeValue() {

  }

  registerOnChange() {

  }

  registerOnTouched() {
    
  }

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