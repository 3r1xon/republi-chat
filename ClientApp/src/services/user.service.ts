import { Inject, Injectable, Injector } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { ServerResponse } from 'src/interfaces/response.interface';
import { Account, UserStatus } from 'src/interfaces/account.interface';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { UtilsService } from './utils.service';
import { DOCUMENT } from '@angular/common';
import { Settings } from 'src/interfaces/settings.interface';
import { environment } from 'src/environments/environment';
import { WebSocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class UserService implements CanActivate {

  constructor(
    private http: HttpClient,
    private router: Router,
    private _utils: UtilsService,
    private cookieService: CookieService,
    private injector: Injector,
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
      .then(async (res: ServerResponse) => {
        if (res.success) {
          this.currentUser = res.data as Account;
          this.userAuth = true;
          this.loadSettings();

          this.initUserSockets();

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
  public logOut(force?: boolean): void {
    this.userAuth = false;

    const del = async () => {
      this.cookieService.deleteAll();

      if (force)
        this.router.navigate(['unauthorized']);
      else {
        await this.router.navigate(['login']);
      }
    }

    this.API_logout()
      .toPromise()
      .then(
        () => del()
      )
      .catch(() => {
        del();
      })
      .finally(() => {
        this.document.defaultView.location.reload();
      });
  }

  public loadSettings(): void {
    this.API_getSettings()
      .toPromise()
      .then((response) => {
        this._utils.settings = response.data as Settings;

        if (this._utils.isMobile) {
          this._utils.settings.showServerGroup = false;
          this._utils.settings.showChannels = false;
        }
      });
  }

  public initUserSockets(): void {

    this.injector
      .get(WebSocketService)
      .listen("userChanges")
      .subscribe((obj: any) => {

        switch(obj.emitType) {

          case "CHANGE_STATUS": {

            this.currentUser.userStatus = obj.status;

          } break;

        }
    });
  }

  public API_signup(user) {
    return this.http.post<ServerResponse>(`${environment.BASE_URL}/authentication/signUp`, user);
  }

  public API_logout() {
    return this.http.delete(`${environment.BASE_URL}/authentication/logout`);
  }

  public API_authorize(data) {
    return this.http.post<ServerResponse>(`${environment.BASE_URL}/authentication/authorize`, data);
  }

  public API_login(data) {
    return this.http.post<ServerResponse>(`${environment.BASE_URL}/authentication/logIn`, data);
  }

  public API_verify(verification_code: string) {
    return this.http.put<ServerResponse>(`${environment.BASE_URL}/authentication/verify/${verification_code}`, null);
  }
  /**
   * API for deleting the user profile.
   *
   * @returns An HTTP request
   *
   */
  public API_deleteProfile() {
    return this.http.delete<ServerResponse>(`${environment.BASE_URL}/authentication/deleteProfile`);
  }

  /**
   * API that gets a list of all user connected devices.
   *
   * @returns An HTTP request
   *
   */
  public API_getDevices() {
    return this.http.get<ServerResponse>(`${environment.BASE_URL}/authentication/getDevices`);
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
    return this.http.delete<ServerResponse>(`${environment.BASE_URL}/authentication/disconnectDevice/${deviceID}`);
  }

  /**
   * API that gets a list of settings.
   *
   * @returns An HTTP request
   *
   */
  public API_getSettings() {
    return this.http.get<ServerResponse>(`${environment.BASE_URL}/authentication/getSettings`);
  }

  public changeUserStatus(status: UserStatus): void {
    this.injector
      .get(WebSocketService)
      .emit("userChanges", {
        status: status,
        emitType: "STATUS_CHANGE"
      });
  }
}
