import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Message } from 'src/interfaces/message.interface';
import { ServerResponse } from 'src/interfaces/response.interface';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { UserService } from 'src/services/user.service';
import { UtilsService } from 'src/services/utils.service';
import { environment } from 'src/environments/environment';
import { REPManager } from 'src/app/lib/rep-manager';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: './p-profile.component.html',
  styleUrls: ['./p-profile.component.scss']
})
export class PProfileComponent extends REPManager implements OnInit {

  constructor(
    public _user: UserService,
    public http: HttpClient,
    private _utils: UtilsService,
    private fb: FormBuilder,
  ) {
    super(http);
  }

  ngOnInit(): void {
    this.setValues(this.form);

    this.setSaveAPI("PUT", `${environment.BASE_URL}/authentication/editProfile`);

    this.valueChanges.subscribe((change) => {
      this.exampleMsg.name = change.name;
    });
  }

  public form: FormGroup = this.fb.group({
    name: [this._user.currentUser.name,
      [
        Validators.maxLength(30),
        Validators.minLength(3),
        // No more than one white space allowed before each word
        Validators.pattern(/^([a-zA-Z0-9]+\s)*[a-zA-Z0-9]+$/)
      ]
    ],
    biography: [this._user.currentUser.biography,
      [
        Validators.maxLength(200)
      ]
    ],
    picture: [this._user.currentUser.picture,
      [

      ]
    ]
  });

  public editName: boolean = false;

  public exampleMsg: Message = {
    name: this._user.currentUser.name,
    message: "Hey, how are you doing?",
    color: this._user.currentUser.color,
    backgroundColor: this._user.currentUser.backgroundColor,
    picture: this._user.currentUser.picture,
    date: new Date(),
    auth: false
  };

  public readonly topbarActions: Array<REPButton> = [
    {
      name: "Save",
      icon: "save",
      enabled: () => this.canSave(),
      background: "success",
      onClick: () => {
        this.save()
          .then((response: ServerResponse) => {
            const newValues = response.data;

            for (const key in newValues) {
              this._user.currentUser[key] = newValues[key];
            }

            this.reset();
           })
          .catch((response: HttpErrorResponse) => {
            console.log(response)
            this._utils.showRequest(
              "Error!",
              response.error.message
            );
          });
      }
    }
  ];

  public readonly strictActions: Array<REPButton> = [
    {
      name: "Delete profile",
      icon: "dangerous",
      tooltip: "Delete all your data",
      background: "danger",
      outline: true,
      onClick: () => { this.deleteProfile(); }
    }
  ];

  deleteProfile() {

    this._utils.showRequest(
      "Are you sure you want to continue?",
      `By doing so your account will be deleted. This action is permanent since RepubliChat will NOT keep the remaining data. If you change your mind you'll be able to create a new account with the same email.`,
      () => {
        this._user.API_deleteProfile()
          .toPromise()
          .then(
            (res) => {
              if (res.success)
                this._user.logOut();
            }
          );

      });
  }

}
