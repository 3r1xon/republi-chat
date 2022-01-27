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
import { first } from 'rxjs/operators';

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

  /**
   * Check if the user has the authorization, gets call when the user refresh the page.
   *
   */
  public async authorize(): Promise<any> {

    const browser = this._utils.detectBrowser();

    const sub = this.http.post<ServerResponse>(`${server.BASE_URL}/authentication/authorize`, {
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
      () => { },
      () => {
        sub.unsubscribe();
      }
    );
  }

  /**
   * LogOut the user redirecting him to another page.
   *
   * @param force If the user authorization has been lost, when true redirect is set to 'unauthorized'.
   *
   */
  public logOut(force?: boolean) {
    this.userAuth = false;

    const del = async () => {
      this.cookieService.deleteAll();

      if (force)
        this.router.navigate(['unauthorized']);
      else {
        await this.router.navigate(['login']);
        this.document.defaultView.location.reload();
      }
    }

    this.http.delete(`${server.BASE_URL}/authentication/logout`)
      .pipe(first())
      .subscribe(
        () => null,
        () => del(),
        () => {
          del();
        }
      );
  }

  /**
   * API for deleting the user profile.
   *
   * @returns An HTTP request
   *
   */
  public deleteProfile() {
    return this.http.delete<ServerResponse>(`${server.BASE_URL}/authentication/deleteProfile`);
  }

  /**
   * API that gets a list of all user connected devices.
   *
   * @returns An HTTP request
   *
   */
  public getDevices() {
    return this.http.get<ServerResponse>(`${server.BASE_URL}/authentication/getDevices`);
  }

  /**
   * API that gets a list of all user connected devices.
   *
   * @param deviceID The device ID that needs to be disconnected.
   * 
   * @returns An HTTP request
   *
   */
  public disconnectDevice(deviceID: number) {
    return this.http.delete<ServerResponse>(`${server.BASE_URL}/authentication/disconnectDevice/${deviceID}`);
  }
}