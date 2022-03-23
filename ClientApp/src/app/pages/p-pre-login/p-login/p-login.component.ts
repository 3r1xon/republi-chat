import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Account } from 'src/interfaces/account.interface';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { FileUploadService } from 'src/services/file-upload.service';
import { UserService } from 'src/services/user.service';
import { UtilsService } from 'src/services/utils.service';

@Component({
  templateUrl: './p-login.component.html',
  styleUrls: ['./p-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PLoginComponent {

  constructor(
    private _user: UserService,
    private _utils: UtilsService,
    private _fileUpload: FileUploadService,
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) { }

  public alert: string;

  public actions: Array<REPButton> = [
    {
      name: "Sign Up",
      icon: "person_add",
      outline: true,
      onClick: () => {
        this.router.navigate(['signup']);
      }
    },
    {
      name: "Log in",
      icon: "login",
      type: "submit",
      enabled: () => this.form.valid,
    }
  ];

  public form: FormGroup = this.fb.group({
    email: ['', // Default value
      [
        Validators.maxLength(320),
        Validators.email
      ]
    ],
    password: ['', // Default value
      [
        Validators.required,
        Validators.maxLength(255)
      ]
    ]
  });

  async logIn() {

    const browser = this._utils.detectBrowser();

    this.document.defaultView.navigator.geolocation.getCurrentPosition(
      (position) => {
        browser.longitude = position.coords.longitude;
        browser.latitude = position.coords.latitude;

        this._user.API_login({ email: this.form.value.email, password: this.form.value.password, BROWSER: browser })
          .toPromise()
          .then(async (response) => {
            this._user.currentUser = <Account>response.data.user;
            this._user.currentUser.picture = this._fileUpload.sanitizeIMG(this._user.currentUser.picture);
            this._user.userAuth = true;
            this._user.loadSettings();
            await this.router.navigate(['mainpage']);
          })
          .catch((response) => {
            this.alert = response.error.message;
          })
          .finally(() => {
            this.cd.markForCheck();
          });

      },
      () => {
          this.alert = "Position is mandatory! Click 'Allow' and try again. Go check your browser settings if the pop-up is not shown.";
      });

  }
}
