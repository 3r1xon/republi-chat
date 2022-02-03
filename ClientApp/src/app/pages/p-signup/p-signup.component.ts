import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { server } from 'src/environments/server';
import { REPButton } from 'src/interfaces/repbutton.interface';
import { ServerResponse } from 'src/interfaces/response.interface';

@Component({
  templateUrl: './p-signup.component.html',
  styleUrls: ['./p-signup.component.scss']
})
export class PSignupComponent {

  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder
  ) { }

  public particleNumber: Array<any> = [];

  public emojis: Array<string> = [
    "😀",
    "🍕",
    "🎳",
    "👽",
    "👀",
    "😈",
    "💀",
    "🤡",
    "🍉",
    "👾",
    "⚾",
    "😍",
    "🎩",
    "👁️",
    "☠️",
    "🥝",
    "🤖",
    "🌴",
    "🌮",
    "🎃",
    "🔥"
  ];

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
      enabled: () => this.form.valid,
      onClick: () => { }
    }
  ];

  public alert: string;

  public form: FormGroup = this.fb.group({
    name: ['',
      [
        Validators.required,
        Validators.maxLength(30),
        Validators.minLength(3),
        // No more than one white space allowed before each word
        Validators.pattern(/^([a-zA-Z0-9]+\s)*[a-zA-Z0-9]+$/)
      ]
    ],
    email: ['',
      [
        Validators.email
      ]
    ],
    password: ['',
      [
        Validators.required,
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

    this.http.post<ServerResponse>(`${server.BASE_URL}/authentication/signUp`, user).subscribe((response) => {
      if (response.success) {
        this.router.navigate(['login']);
      }
    },
    (response) => {
      this.alert = response.error.message;
    });
  }

}
