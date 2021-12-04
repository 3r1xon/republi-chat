import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ServerResponse } from 'src/interfaces/response.interface';
import { database } from 'src/environments/database';
import { Account } from 'src/interfaces/account.interface';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { FileUploadService } from './file-upload.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class UserService implements CanActivate {

  constructor(
    private http: HttpClient,
    private router: Router,
    private _fileUpload: FileUploadService,
    private _utils: UtilsService,
    private cookieService: CookieService) {}

  public currentUser?: Account;

  public userAuth: boolean = false;

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
    if (!this.userAuth && !this._utils.loading)
      this.deAuth();
    return this.userAuth;
  }

  public async authorize(): Promise<any> {
    const REFRESH_TOKEN = this.cookieService.get("REFRESH_TOKEN");

    if (!REFRESH_TOKEN) return;
    
    const response = await this.http.post<ServerResponse>(`${database.BASE_URL}/authentication/authorize`, {
      REFRESH_TOKEN: REFRESH_TOKEN
    }).toPromise();
    if (response.success) {
      this.currentUser = <Account>response.data;
      this.currentUser.profilePicture = this._fileUpload.sanitizeIMG(this.currentUser.profilePicture);
      this.userAuth = true;
      await this.router.navigate(['mainpage']);
    } else {
      this.router.navigate(['login']);
      localStorage.clear();
      this.cookieService.deleteAll();
    }
  }

  public async logOut(): Promise<any> {
    await this.http.delete(`${database.BASE_URL}/authentication/logout`).toPromise();

    localStorage.clear();
    this.cookieService.deleteAll();

    this.userAuth = false;

    await this.router.navigate(['login']);
    window.location.reload();
  }

  public async deAuth() {
    await this.http.delete(`${database.BASE_URL}/authentication/logout`).toPromise();

    localStorage.clear();
    this.cookieService.deleteAll();

    this.currentUser = null;
    
    await this.router.navigate(['unauthorized']);
    
    this.userAuth = false;
  }


  public deleteProfile() {
    return this.http.delete<ServerResponse>(`${database.BASE_URL}/authentication/deleteProfile`);
  }


}