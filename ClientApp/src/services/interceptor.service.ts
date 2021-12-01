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
import { CookieService } from 'ngx-cookie-service';
import { UserService } from './user.service';
import { database } from 'src/environments/database';


@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(
    private _utils: UtilsService,
    private _user: UserService,
    private cookieService: CookieService,
    ) { }

  private loadingWhiteList: Array<string> = [
    `${database.BASE_URL}/messages/sendMessage`,
    `${database.BASE_URL}/messages/deleteMessage`
  ];

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const route = this.loadingWhiteList.find(route => route == req.url);
    
    this._utils.loading = route != req.url;

    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`),
      withCredentials: true
    });

    return next.handle(authReq).pipe(tap((res: any) => {

      if (res instanceof HttpResponse) {
        const ACCESS_TOKEN = res.headers.get("ACCESS_TOKEN");
        const REFRESH_TOKEN = res.headers.get("REFRESH_TOKEN");

        if (ACCESS_TOKEN && REFRESH_TOKEN) {
          localStorage.setItem("ACCESS_TOKEN", ACCESS_TOKEN);
          this.cookieService.set("REFRESH_TOKEN", REFRESH_TOKEN);
        }

        this._utils.loading = false;
      }
    }, (err: HttpErrorResponse) => {
      this._utils.loading = false;

      if (err.status == 401 && this._user.userAuth) { 
        this._user.deAuth();
      }
    }));
  }

}
