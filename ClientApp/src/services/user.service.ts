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
import { Settings } from 'src/interfaces/settings.interface';

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
  ) { }

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

    this.API_authorize({ BROWSER: browser })
      .toPromise()
      .then(async (res) => {
        if (res.success) {
          this.currentUser = res.data as Account;
          this.currentUser.picture = this._fileUpload.sanitizeIMG(this.currentUser.picture);
          this.userAuth = true;
          this.loadSettings();
          await this.router.navigate(['mainpage']);
        }
      });
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

    this.API_logout()
      .toPromise()
      .then(
        () => del()
      )
      .catch(() => {
        del();
      });
  }

  public loadSettings() {
    this.API_getSettings()
      .toPromise()
      .then((response) => {
        this._utils.settings = response.data as Settings;
      });
  }

  public API_signup(user) {
    return this.http.post<ServerResponse>(`${server.BASE_URL}/authentication/signUp`, user);
  }

  public API_logout() {
    return this.http.delete(`${server.BASE_URL}/authentication/logout`);
  }

  public API_authorize(data) {
    return this.http.post<ServerResponse>(`${server.BASE_URL}/authentication/authorize`, data);
  }

  public API_login(data) {
    return this.http.post<ServerResponse>(`${server.BASE_URL}/authentication/logIn`, data);
  }
  /**
   * API for deleting the user profile.
   *
   * @returns An HTTP request
   *
   */
  public API_deleteProfile() {
    return this.http.delete<ServerResponse>(`${server.BASE_URL}/authentication/deleteProfile`);
  }

  /**
   * API that gets a list of all user connected devices.
   *
   * @returns An HTTP request
   *
   */
  public API_getDevices() {
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
  public API_disconnectDevice(deviceID: number) {
    return this.http.delete<ServerResponse>(`${server.BASE_URL}/authentication/disconnectDevice/${deviceID}`);
  }

  /**
   * API that gets a list of settings.
   *
   * @returns An HTTP request
   *
   */
  public API_getSettings() {
    return this.http.get<ServerResponse>(`${server.BASE_URL}/authentication/getSettings`);
  }
}