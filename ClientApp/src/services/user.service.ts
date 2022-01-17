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
    
    const sub = this.http.post<ServerResponse>(`${server.BASE_URL}/authentication/authorize`, {
      REFRESH_TOKEN: REFRESH_TOKEN,
      BROWSER: browser
    })
      .subscribe(async (res) => {
        if (res.success) {
          this.currentUser = <Account>res.data;
          this.currentUser.picture = this._fileUpload.sanitizeIMG(this.currentUser.picture);
          this.userAuth = true;
          await this.router.navigate(['mainpage']);
        }
      }, 
      (err) => {
        this.logOut();
      },
      () => {
        sub.unsubscribe();
      }
    );
  }


  public async logOut(force?: boolean): Promise<any> {
    this.userAuth = false;
    
    const sub = this.http.delete(`${server.BASE_URL}/authentication/logout`).subscribe();

    sub.unsubscribe();

    this.cookieService.deleteAll();

    if (force)
      await this.router.navigate(['unauthorized']);
    else {
      await this.router.navigate(['login']);
      this.document.defaultView.location.reload();
    }
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