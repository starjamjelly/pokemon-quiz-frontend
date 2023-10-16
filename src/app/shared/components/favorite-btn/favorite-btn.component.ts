import { Component, OnInit, Input } from '@angular/core';
import { take, Observable, of, takeWhile, map } from 'rxjs';
import { FavoriteStateManagementService } from '../../services/favorite-state-management.service';

/*
 * お気に入りボタン
 */
@Component({
  selector: 'app-favorite-btn',
  templateUrl: './favorite-btn.component.html',
  styleUrls: ['./favorite-btn.component.scss'],
})
export class FavoriteBtnComponent implements OnInit {
  private isLoaded = false;
  @Input() is_favorite: boolean = false;

  /**
   * コンポーネント表示時処理
   */
  ngOnInit(): void {}

  /**
   * コンストラクタ
   */
  constructor(private favorite_state_management_service: FavoriteStateManagementService) {
    // サーバーから状態を取得する。これ以後はクライアントの状態を優先してViewに反映させる。
    this.favorite_state_management_service
      .getState$()
      .pipe(take(1))
      .subscribe((is_favorite) => {
        this.is_favorite = is_favorite;
        this.isLoaded = true;
      });
  }

  /**
   * サーバー側のお気に入り状態を取得する
   *
   * @returns {Observable<boolean>}
   */
  get serverState$(): Observable<boolean> {
    return this.favorite_state_management_service.getState$();
  }

  /**
   * お気に入りボタン押下時処理
   *
   * @returns {void}
   */
  handleUpdateFavoriteState(): void {
    of(this.is_favorite)
      .pipe(
        takeWhile(() => this.isLoaded),
        map((is_favorite) => !is_favorite)
      )
      .subscribe((is_favorite) => {
        this.is_favorite = is_favorite;
        this.favorite_state_management_service.requestUpdateFovoriteState(is_favorite);
      });
  }
}
