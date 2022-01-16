import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { server } from 'src/environments/server';
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

  public alert: string = "";

  public form: FormGroup = this.fb.group({
    name: ['',
      [Validators.required, Validators.maxLength(30)]
    ],
    email: ['',
      [Validators.required, Validators.email]
    ],
    password: ['',
      [Validators.required, Validators.maxLength(30)]
    ],
    confirmPassword: ['',
      [Validators.required, Validators.maxLength(30)]
    ]
  });

  signUp() {

    const user = this.form.value;

    if (user.password != user.confirmPassword) {
      this.alert = "Password is not the same!";
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
