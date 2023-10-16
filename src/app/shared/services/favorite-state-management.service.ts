import { Injectable } from '@angular/core';
import { Observable, Subject, ReplaySubject, concatMap, switchMap } from 'rxjs';

import { InitPokedexDetail } from '../../domain/pokedex/service/pokedex-client.service';
import { PokedexClientService } from '../../domain/pokedex/service/pokedex-client.service';

@Injectable({
  providedIn: 'root',
})
export class FavoriteStateManagementService {
  private pokemon: InitPokedexDetail;
  private requester$ = new Subject<boolean>();
  private dispatcher$ = new Subject<void>();
  private provider$ = new ReplaySubject<boolean>(1);

  /**
   * コンストラクタ
   */
  constructor(private pokedex_client_service: PokedexClientService) {
    // サーバーにPOSTリクエストを送る。
    this.requester$
      .pipe(concatMap((is_favorite) => this.updateFavoriteState(is_favorite)))
      .subscribe(() => {
        this.dispatcher$.next();
      });

    // dispatcherがnextされる度にサーバーから状態を取得し直す。
    this.dispatcher$
      .pipe(switchMap(() => this.checkFavoriteStateOnServer()))
      .subscribe((is_favorite_on_server) => {
        this.provider$.next(is_favorite_on_server);
      });

    // サーバーから初期状態を取得するまで敢えて時間をかける
    setTimeout(() => {
      this.dispatcher$.next();
    }, 3000);
  }

  /**
   * 詳細画面に表示中のポケモン情報を保持する
   *
   * @param {InitPokedexDetail} pokemon 対象のポケモン情報
   */
  setPokemonState(pokemon: InitPokedexDetail): void {
    this.pokemon = pokemon;
  }

  /**
   * サーバー側でのお気に入り状態をチェックする
   *
   * @returns {Promise<boolean>}
   */
  private checkFavoriteStateOnServer(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        this.pokedex_client_service.checkFavoriteState(this.pokemon.pokedex_id).subscribe(() => {
          resolve(this.pokemon.is_favorite);
        });
      }, 1000);
    });
  }

  /**
   * サーバー側のお気に入り状態を更新する
   *
   * @param {boolean} is_favorite 変更後のお気に入り状態
   * @returns {Promise<void>}
   */
  private updateFavoriteState(is_favorite: boolean): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.pokedex_client_service.updateFavoriteState(this.pokemon.pokedex_id).subscribe(() => {
          this.pokemon.is_favorite = is_favorite;
          resolve();
        });
      }, 1);
    });
  }

  /**
   * 現在のお気に入り状態を取得する
   *
   * @returns {Observable<boolean>}
   */
  getState$(): Observable<boolean> {
    return this.provider$;
  }

  /**
   * リクエスト用Subjectに値を流し、お気に入り状態の更新を開始する
   *
   * @param {boolean} is_favorite
   */
  requestUpdateFovoriteState(is_favorite: boolean): void {
    this.requester$.next(is_favorite);
  }
}
