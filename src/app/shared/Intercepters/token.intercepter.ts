import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenIntercepter implements HttpInterceptor {
  /**
   * Angularからhttpリクエストを送信する際にJWTトークンをインターセプトする
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string = localStorage.getItem('app-access');
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `JWT ${token}`,
        },
      });
    }
    return next.handle(req);
  }
}
