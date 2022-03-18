import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { UserService } from 'src/services/user.service';

@Component({
  templateUrl: './p-signup.component.html',
  styleUrls: ['./p-signup.component.scss']
})
export class PSignupComponent {

  constructor(
    private _user: UserService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  public actions: Array<REPButton> = [
    {
      name: "Log in",
      icon: "login",
      outline: true,
      onClick: () => {
        this.router.navigate(['login']);
      }
    },
    {
      name: "Sign Up",
      icon: "person_add",
      type: "submit",
      enabled: () => this.form.valid
    }
  ];

  public alert: string;

  public success: boolean;

  public form: FormGroup = this.fb.group({
    name: ['',
      [
        Validators.maxLength(30),
        Validators.minLength(3),
        // No more than one white space allowed before each word
        Validators.pattern(/^([a-zA-Z0-9]+\s)*[a-zA-Z0-9]+$/)
      ]
    ],
    email: ['',
      [
        Validators.email,
        Validators.maxLength(320)
      ]
    ],
    password: ['',
      [
        Validators.maxLength(255),
        Validators.minLength(8),
      ]
    ],
    confirmPassword: ['',
      [
        Validators.required,
        Validators.maxLength(255)
      ]
    ]
  });

  signUp() {

    const user = this.form.value;

    if (user.password != user.confirmPassword) {
      this.alert = "Password is not the same!";
      this.form.controls["confirmPassword"].setValue('');
      return;
    }

    this._user.API_signup(user)
      .toPromise()
      .then((response) => {
        this.success = true;
        this.alert = response.message;
        this.form.reset();
      }).catch((response: HttpErrorResponse) => {
        this.alert = response.error.message;
        this.success = false;
      });
  }

}
