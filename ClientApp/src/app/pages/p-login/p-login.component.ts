import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { server } from 'src/environments/server';
import { Account } from 'src/interfaces/account.interface';
import { ServerResponse } from 'src/interfaces/response.interface';
import { FileUploadService } from 'src/services/file-upload.service';
import { UserService } from 'src/services/user.service';
import { UtilsService } from 'src/services/utils.service';

@Component({
  templateUrl: './p-login.component.html',
  styleUrls: ['./p-login.component.scss']
})
export class PLoginComponent implements OnInit {

  constructor(
    private _user: UserService,
    private _utils: UtilsService,
    private _fileUpload: FileUploadService,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder
    ) { }

  ngOnInit(): void {
  }

  public alert: string = "";

  public emojis: Array<string> = [
    "😀",
    "🍕",
    "😃",
    "🤡",
    "😅",
    "👽",
    "😇",
    "😈",
    "😉",
    "🍉",
    "😋",
    "😌",
    "😍",
    "🤬",
    "😏",
    "🤾",
    "🥝",
    "😒",
    "🥕",
    "🌮",
    "🎃",
    "🔥"
  ];

  public form: FormGroup = this.fb.group({
    email: ['erixonconsoli@hotmail.it', // Default value
      [Validators.required, Validators.maxLength(30), Validators.email]
    ],
    password: ['123', // Default value
      [Validators.required, Validators.maxLength(30)]
    ]
  });

  async logIn() {

    if (!this.form.valid) return;

    const browser = this._utils.detectBrowser();

    navigator.geolocation.getCurrentPosition((position) => {
      browser.longitude = position.coords.longitude;
      browser.latitude = position.coords.latitude;

      this.http.post<ServerResponse>(`${server.BASE_URL}/authentication/logIn`, {
        email: this.form.value.email,
        password: this.form.value.password,
        BROWSER: browser
      })
        .pipe(first())
        .subscribe(async (response) => {
          this._user.currentUser = <Account>response.data.user;
          this._user.currentUser.picture = this._fileUpload.sanitizeIMG(this._user.currentUser.picture);
          this._user.userAuth = true;
          await this.router.navigate(['mainpage']);
        }, 
        (response) => {
          this.alert = response.error.message;
        });
    }, () => {
        this.alert = "Position is mandatory! Try again.";
    });

  }
}