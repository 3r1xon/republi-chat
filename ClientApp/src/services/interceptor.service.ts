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
      .set('Authorization', `Bearer ${localStorage.getItem('TOKEN')}`)
    });
    
    return next.handle(authReq).pipe(tap((cb: any) => {
      if (cb.body?.success) {
        this._utils.loading = false;
      }
    }, (err) => {
      console.log(err);
    }));
  }

}
