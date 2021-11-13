import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ServerResponse } from 'src/interfaces/response.interface';
import { database } from 'src/environments/database';
import { Account } from 'src/interfaces/account.interface';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserService implements CanActivate {

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService) {}

  public currentUser?: Account;

  public userAuth: boolean = false;

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
    return this.userAuth;
  }

  public async logIn(userName: string, password: string): Promise<any> {
    const response = await this.http.post<ServerResponse>(`${database.BASE_URL}/logIn`, {
      userName: userName,
      password: password
    }).toPromise();
    if (response.success) {
      this.currentUser = <Account>response.data.user;
      this.userAuth = true;

      this.router.navigate(['mainpage']);
    } else {
      return response.message;
    }
  }

  public async authorize() {
    const response = await this.http.post<ServerResponse>(`${database.BASE_URL}/authorize`, {
      REFRESH_TOKEN: this.cookieService.get("REFRESH_TOKEN")
    }).toPromise();
    if (response.success) {
      this.currentUser = <Account>response.data;
      this.userAuth = true;

      this.router.navigate(['mainpage']);
    } else {
      this.router.navigate(['login']);
      localStorage.clear();
      this.cookieService.deleteAll();
    }
  }

  public async logOut() {
    localStorage.clear();
    this.cookieService.deleteAll();
    this.userAuth = false;
    window.location.reload();
  }

}