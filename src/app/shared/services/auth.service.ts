import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as moment from 'moment';
import { BehaviorSubject, mergeMap, Observable, of, switchMap, tap } from 'rxjs';
import { API_URL_V1 } from 'src/app/app-const';
import { JwtToken } from '../types/type';

type Login = {
  username: string;
  password: string;
};

type Signup = {
  username: string;
  password: string;
  confirm_password: string;
};

type User = {
  username: string;
};

const jwt = new JwtHelperService();

class DecodedToken {
  user_id: string = '';
  user_name: string = '';
  exp: number = 0;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user: BehaviorSubject<User | null>;
  private access_token: DecodedToken =
    JSON.parse(localStorage.getItem('app-access-meta')) || new DecodedToken();
  private refresh_token: DecodedToken =
    JSON.parse(localStorage.getItem('app-refresh-meta')) || new DecodedToken();

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * 認証情報の有効性を確認
   * - ローカルストレージのアクセストークンの有効期限を確認
   *
   * @returns {boolean}
   */
  isAuthenticated(): boolean {
    return moment().isBefore(moment.unix(this.access_token.exp));
  }

  /**
   * 認証情報の有効性を確認
   * - ローカルストレージのリフレッシュトークンの有効期限を確認
   *
   * @returns {boolean}
   */
  canRefreshTokenInfo(): boolean {
    return moment().isBefore(moment.unix(this.refresh_token.exp));
  }

  /**
   * サインアップリクエストを送信
   *
   * @param {Signup} signup_info - username, password, confirm_password
   * @returns {Observable<boolean>}
   */
  signup(signup_info: Signup): Observable<boolean> {
    return this.http.post<boolean>(`${API_URL_V1}account/signup/`, signup_info);
  }

  /**
   * ログイン処理
   * - ログインの成功か失敗を真偽地で返却
   * - JWTトークンの取得まで行う
   *
   * @param {Login} login_info - username, password
   * @returns {Observable<boolean>}
   */
  login(login_info: Login): Observable<boolean> {
    return this.http.post<boolean>(`${API_URL_V1}account/login/`, login_info).pipe(
      mergeMap((is_auth: boolean) => {
        // 入力値で認証できた場合はJWTトークンを取得
        if (is_auth) {
          return this.createJwtToken(login_info).pipe(
            tap((token: JwtToken) => {
              // 認証情報(JWT)をローカルストレージで保持
              this.access_token = jwt.decodeToken(token.access);
              this.refresh_token = jwt.decodeToken(token.refresh);
              localStorage.setItem('app-access', token.access);
              localStorage.setItem('app-refresh', token.refresh);
              localStorage.setItem('app-access-meta', JSON.stringify(this.access_token));
              localStorage.setItem('app-refresh-meta', JSON.stringify(this.refresh_token));
              // ログインユーザーオブジェクトをストアで保持
              const login_user: User = {
                username: login_info.username,
              };
              this.user = new BehaviorSubject<User>(login_user);
            }),
            switchMap(() => {
              return of(true);
            })
          );
        }
        return of(false);
      })
    );
  }

  /**
   * アクセストークンのリフレッシュ処理
   * - アクセストークンが有効期限切れかつリフレッシュトークンが有効期限内の場合に呼び出すようにする
   */
  updateTokenByRefresh(): Observable<boolean> {
    return this.refreshFwtToken().pipe(
      tap((token: JwtToken) => {
        // 認証情報(JWT)をローカルストレージで保持
        this.access_token = jwt.decodeToken(token.access);
        localStorage.setItem('app-access', token.access);
        localStorage.setItem('app-access-meta', JSON.stringify(this.access_token));
      }),
      switchMap(() => {
        return of(true);
      })
    );
  }

  /**
   * JWTトークンを取得する
   * - djoserデフォルトのエンドポイント
   *
   * @param {Login} login_info - username, password
   * @returns {Observable<JwtToken>}
   */
  createJwtToken(login_info: Login): Observable<JwtToken> {
    return this.http.post<JwtToken>(`${API_URL_V1}account/jwt/create/`, login_info);
  }

  /**
   * リフレッシュされたJWTトークンを取得する
   * - djoserデフォルトのエンドポイント
   */
  refreshFwtToken(): Observable<JwtToken> {
    return this.http.post<JwtToken>(`${API_URL_V1}account/jwt/refresh/`, {
      refresh: localStorage.getItem('app-refresh'),
    });
  }

  /**
   * ログアウト機能
   *
   * @returns {boolean}
   */
  logout(): boolean {
    try {
      localStorage.removeItem('app-access');
      localStorage.removeItem('app-refresh');
      localStorage.removeItem('app-access-meta');
      localStorage.removeItem('app-refresh-meta');
      this.access_token = new DecodedToken();
      this.user = new BehaviorSubject<User | null>(null);
      this.router.navigate(['/login']);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * ログイン中ユーザーの情報がセットされているか確認する
   *
   * @returns
   */
  isSetStatus(): boolean {
    if (typeof this.user !== 'undefined') {
      return this.user.getValue() !== null;
    }
    return false;
  }

  /**
   * ログイン中ユーザーの情報を取得する
   *
   * @param status_key ユーザーオブジェクトのキー
   * @returns
   */
  getStatus(status_key: keyof User): User[typeof status_key] {
    const login_status = this.user.getValue();
    return login_status[status_key];
  }
}
