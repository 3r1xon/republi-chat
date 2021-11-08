import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilsService } from './utils.service';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(public _utils: UtilsService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this._utils.loading = true;

    const authReq = req.clone({
      headers: req.headers.set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`),
      withCredentials: true
    });

    return next.handle(authReq).pipe(tap((res: any) => {

      if (res instanceof HttpResponse) {
        console.log(res);
        const ACCESS_TOKEN = res.headers?.get("ACCESS_TOKEN");
        const REFRESH_TOKEN = res.headers?.get("REFRESH_TOKEN");

        if (ACCESS_TOKEN && REFRESH_TOKEN) {
          localStorage.setItem("ACCESS_TOKEN", ACCESS_TOKEN);
          document.cookie = `REFRESH_TOKEN=${REFRESH_TOKEN}`;
        }

        this._utils.loading = false;
      }
    }, (err) => {
      console.log(err);
    }));
  }

}
