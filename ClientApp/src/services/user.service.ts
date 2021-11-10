import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ServerResponse } from 'src/interfaces/response.interface';
import { database } from 'src/environments/database';
import { Account } from 'src/interfaces/account.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService implements CanActivate {

  constructor(
    private http: HttpClient,
    private router: Router) {}

  public currentUser?: Account;

  public userAuth: boolean = false;

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
    return this.userAuth;
  }

  async logIn(userName: string, password: string): Promise<any> {
    const response = await this.http.post<ServerResponse>(`${database.BASE_URL}/logIn`, {
      userName: userName,
      password: password
    }).toPromise();
    if (!response.success) {
      return response.message;
    } else {
      const { user } = response.data;
      
      this.currentUser = <Account>user;
      this.userAuth = true;

      this.router.navigate(['mainpage']);
    }
  }

  async authorize() {
    const response = await this.http.post<ServerResponse>(`${database.BASE_URL}/authorize`, {
      REFRESH_TOKEN: document.cookie.split("REFRESH_TOKEN=")[1]
    }).toPromise();
    if (response.success) {
      const { user } = response.data;

        this.currentUser = <Account>user;
        this.userAuth = true;

        this.router.navigate(['mainpage']);
    } else {
      this.router.navigate(['login']);
      localStorage.clear();
      document.cookie = "";
    }
  }

  async logOut() {
    localStorage.clear();
    document.cookie = "";
    this.userAuth = false;
    this.currentUser = undefined;
    this.router.navigate(['login']);
  }

}
