import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ServerResponse } from 'src/interfaces/response.interface';
import { database } from 'src/environments/database';
import { Account } from 'src/interfaces/account.interface';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class UserService implements CanActivate {

  constructor(
    private http: HttpClient,
    private router: Router,
    private sanitizer: DomSanitizer,
    private cookieService: CookieService) {}

  public currentUser?: Account;

  public userAuth: boolean = false;

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
    if (!this.userAuth)
      this.router.navigate(['unauthorized']);
    return this.userAuth;
  }

  public async logIn(userName: string, password: string): Promise<any> {
    const response = await this.http.post<ServerResponse>(`${database.BASE_URL}/authentication/logIn`, {
      userName: userName,
      password: password
    }).toPromise();
    if (response.success) {
      this.currentUser = <Account>response.data.user;
      this.currentUser.profilePicture = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + this.currentUser.profilePicture);
      this.userAuth = true;

      await this.router.navigate(['mainpage']);
    } else {
      return response.message;
    }
  }

  public async authorize(): Promise<any> {
    const REFRESH_TOKEN = this.cookieService.get("REFRESH_TOKEN");

    if (!REFRESH_TOKEN) return;
    
    const response = await this.http.post<ServerResponse>(`${database.BASE_URL}/authentication/authorize`, {
      REFRESH_TOKEN: REFRESH_TOKEN
    }).toPromise();
    if (response.success) {
      this.currentUser = <Account>response.data;
      this.currentUser.profilePicture = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + this.currentUser.profilePicture);
      this.userAuth = true;
      await this.router.navigate(['mainpage']);
    } else {
      this.router.navigate(['login']);
      localStorage.clear();
      this.cookieService.deleteAll();
    }
  }

  public async logOut(): Promise<any> {
    localStorage.clear();
    this.cookieService.deleteAll();
    this.userAuth = false;
    await this.router.navigate(['login']);
    window.location.reload();
  }

}