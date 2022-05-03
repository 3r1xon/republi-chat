import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilsService } from './utils.service';
import { tap } from 'rxjs/operators';
import { UserService } from './user.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(
    private _utils: UtilsService,
    private _user: UserService,
  ) { }

  private readonly loadingBlackList: Array<string> = [
    `${environment.BASE_URL}/channels/getChannels`,
    `${environment.BASE_URL}/channels/changeChOrder`,
    `${environment.BASE_URL}/channels/changeRoomsOrder`,
    `${environment.BASE_URL}/messages/getChannelMessages`,
    `${environment.BASE_URL}/messages/getChannelPermissions`,
    `${environment.BASE_URL}/authentication/getSettings`,
  ];

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const blacklisted = !this.loadingBlackList.some(route => req.url.startsWith(route));

    this._utils.loading = blacklisted;

    const authReq = req.clone({
      headers: req.headers
        .set('RequestDate', `${new Date().getTime()}`),
      withCredentials: true
    });

    return next.handle(authReq).pipe(tap((res: any) => {

      if (res instanceof HttpResponse) {

        this._utils.loading = false;
      }
    }, (err: HttpErrorResponse) => {
      this._utils.loading = false;

      // Loop warning, AND operator is mandatory!
      if (err.status == 401 && this._user.userAuth) {
        this._user.logOut(true);
      }
    }));
  }

}
