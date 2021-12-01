import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { database } from 'src/environments/database';
import { ServerResponse } from 'src/interfaces/response.interface';

@Component({
  templateUrl: './p-signup.component.html',
  styleUrls: ['./p-signup.component.scss']
})
export class PSignupComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.particleNumber = Array(30).fill(0);
  }

  public particleNumber: Array<any> = []; 

  public user = {
    userName: "",
    name: "",
    password: "",
  };

  public confirmPassword: string = "";

  public alert: string = "";

  signUp() {

    if (this.user.password != this.confirmPassword) {
      this.alert = "Password is not the same!";
      return;
    }

    this.http.post<ServerResponse>(`${database.BASE_URL}/authentication/signUp`, this.user).subscribe((response) => { 
      if (response.success) {
        this.router.navigate(['login']);
      }
    }, 
    (response) => {
      this.alert = response.error.message;
    });
  }

}
