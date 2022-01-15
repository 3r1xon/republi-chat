import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ServerResponse } from 'src/interfaces/response.interface';
import { server } from 'src/environments/server';
import { Account } from 'src/interfaces/account.interface';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { FileUploadService } from './file-upload.service';
import { UtilsService } from './utils.service';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserService implements CanActivate {

  constructor(
    private http: HttpClient,
    private router: Router,
    private _fileUpload: FileUploadService,
    private _utils: UtilsService,
    private cookieService: CookieService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  public currentUser?: Account;

  public userAuth: boolean = false;

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
    return this.userAuth;
  }

  
  public async authorize(): Promise<any> {
    const REFRESH_TOKEN = this.cookieService.get("REFRESH_TOKEN");

    if (!REFRESH_TOKEN) return;

    const browser = this._utils.detectBrowser();
    
    const response = await this.http.post<ServerResponse>(`${server.BASE_URL}/authentication/authorize`, {
      REFRESH_TOKEN: REFRESH_TOKEN,
      BROWSER: browser
    }).toPromise();
    if (response.success) {
      this.currentUser = <Account>response.data;
      this.currentUser.picture = this._fileUpload.sanitizeIMG(this.currentUser.picture);
      this.userAuth = true;
      await this.router.navigate(['mainpage']);
    } else {
      this.deAuth();
    }
  }


  public async logOut(): Promise<any> {
    this.http.delete(`${server.BASE_URL}/authentication/logout`).toPromise();

    this.cookieService.deleteAll();

    this.userAuth = false;

    await this.router.navigate(['login']);
    this.document.defaultView.location.reload();
  }


  public async deAuth() {
    this.http.delete(`${server.BASE_URL}/authentication/logout`).toPromise();
  
    this.cookieService.deleteAll();

    await this.router.navigate(['unauthorized']);
  }


  public deleteProfile() {
    return this.http.delete<ServerResponse>(`${server.BASE_URL}/authentication/deleteProfile`);
  }

  public getDevices() {
    return this.http.get<ServerResponse>(`${server.BASE_URL}/authentication/getDevices`);
  }

  public disconnectDevice(deviceID: number) {
    return this.http.delete<ServerResponse>(`${server.BASE_URL}/authentication/disconnectDevice/${deviceID}`);
  }
}