import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard {
  constructor(private auth_service: AuthService, private router: Router) {}

  /**
   * 画面遷移時に呼び出されるAuthGuard
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // アクセストークンが有効期限内なら許可
    if (this.auth_service.isAuthenticated()) return true;

    // リフレッシュトークンが有効期限内ならトークンを更新
    if (this.auth_service.canRefreshTokenInfo()) {
      this.auth_service.updateTokenByRefresh().subscribe();
      return true;
    }

    // トークンの有効期限が切れている
    this.auth_service.logout();
    this.router.navigate(['/login']);
    return false;
  }
}
