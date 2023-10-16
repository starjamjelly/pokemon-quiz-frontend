import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { first, firstValueFrom, Observable, pipe } from 'rxjs';

import { API_URL_V1 } from 'src/app/app-const';
import { Type } from 'src/app/shared/types/model-type';
import { AuthService } from '../../../shared/services/auth.service';

export type ARPokemon = {
  pokedex_id: number;
  pokemon_name: string;
  image_path: string;
  types: { color_code: string }[];
};

export type InitPokedex = {
  pokemons: ARPokemon[];
  max_generation: number;
};

export type InitPokedexDetail = {
  pokedex_id: number;
  pokemon_name: string;
  image_path: string;
  genus: string;
  characteristic: string;
  is_favorite: boolean;
  types: Type[];
};

export type ARMatchNamePokemon = {
  pokemons: ARPokemon[];
};

export type ARAllFavoritePokemon = {
  pokemons: ARPokemon[];
};

export type ARMatchGenerationPokemon = {
  pokemons: ARPokemon[];
  max_generation: number;
};

/*
 * ポケモン図鑑機能 サービス
 */
@Injectable({
  providedIn: 'root',
})
export class PokedexClientService {
  private pokemon: InitPokedexDetail;

  /**
   * コンストラクタ
   */
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private auth_service: AuthService
  ) {}

  /**
   * 詳細画面で対象になっているポケモン情報を保持する
   *
   * @param {InitPokedexDetail} pokemon 表示中のポケモン
   */
  setPokemonState(pokemon: InitPokedexDetail): void {
    this.pokemon = pokemon;
  }

  /**
   * 詳細画面で対象になっているポケモン情報を取得する
   *
   * @returns {InitPokedexDetail}
   */
  getPokemonState(): InitPokedexDetail {
    return this.pokemon;
  }

  /**
   * ポケモン一覧画面の初期表示情報を取得
   *
   * @returns {Observable<InitPokedex>}
   */
  initList(): Observable<InitPokedex> {
    return this.http.get<InitPokedex>(`${API_URL_V1}pokedex/`);
  }

  /**
   * ポケモン詳細画面の初期表示情報を取得
   *
   * @param {number} id - 選択されたポケモンのID
   * @returns {Observable<InitPokedexDetail>}
   */
  initDetail(id: number = 0): Observable<InitPokedexDetail> {
    return this.http.get<InitPokedexDetail>(`${API_URL_V1}pokedex/detail/${id}/`);
  }

  /**
   * 入力された文字列を名前に含むポケモンの一覧を取得
   *
   * @param {string} pokemon_name
   * @returns {Observable<ARMatchNamePokemon>}
   */
  getMatchNamePokemons(pokemon_name: string): Observable<ARMatchNamePokemon> {
    const req_body = { pokemon_name };
    return this.http.post<ARMatchNamePokemon>(
      `${API_URL_V1}pokedex/search-pokemon-name/`,
      req_body
    );
  }

  /**
   * 全てのお気に入りポケモンを取得
   *
   * @returns {Observable<ARAllFavoritePokemon>}
   */
  getAllFavoritePokemon(): Observable<ARAllFavoritePokemon> {
    const req_body = {};
    return this.http.post<ARAllFavoritePokemon>(
      `${API_URL_V1}pokedex/get-all-favorite-pokemon/`,
      req_body
    );
  }

  /**
   * 選択された世代のポケモン一覧を取得
   *
   * @param {number} generation - 選択された世代リストボックスの値（全世代検索なら'0'）
   * @returns {Observable<ARMatchGenerationPokemon>}
   */
  getMatchGenerationPokemons(generation: number): Observable<ARMatchGenerationPokemon> {
    return this.http.post<ARMatchGenerationPokemon>(
      `${API_URL_V1}pokedex/select-generation/`,
      generation
    );
  }

  /**
   * 引数で渡されたポケモンのお気に入り状態を更新する
   * - テーブルにレコードがあればお気に入りと判断できる
   *
   * @param {number} pokedex_id 対象のポケモン図鑑No
   * @returns {Observable<void>}
   */
  updateFavoriteState(pokedex_id: number): Observable<void> {
    const body = {
      pokedex_id,
    };
    return this.http.put<void>(`${API_URL_V1}pokedex/toggle-favorite-state/`, body);
  }

  /**
   * 引数で渡されたポケモンのお気に入り状態を確認する
   *
   * @param {number} pokedex_id 対象のポケモン図鑑No
   * @returns {Observable<void>}
   */
  checkFavoriteState(pokedex_id: number): Observable<boolean> {
    const body = {
      pokedex_id,
    };
    return this.http.post<boolean>(`${API_URL_V1}pokedex/check-favorite-state/`, body);
  }
}
