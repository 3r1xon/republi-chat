import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { database } from 'src/environments/database';
import { ServerResponse } from 'src/interfaces/response.interface';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private router: Router
    ) { }

  ngOnInit(): void {
  }

  public userName: string = "";
  public password: string = "";
  public confirmPassword: string = "";

  public alert: string = "";

  signUp() {

    if (this.password != this.confirmPassword) {
      this.alert = "Password is not the same!";
      return;
    }

    this.http.post<ServerResponse>(`${database.BASE_URL}/authentication/signUp`, {
      userName: this.userName,
      password: this.password
    }).subscribe((response) => { 
      if (!response.success) {
        this.alert = <string>response.message;
      } else {
        this.router.navigate(['login']);
      }
    });
  }

}
