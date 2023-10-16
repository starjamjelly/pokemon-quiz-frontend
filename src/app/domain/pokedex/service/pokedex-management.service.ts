import { Injectable } from '@angular/core';
import { PokemonCardView } from '../pages/page-pokedex/page-pokedex.component';

/*
 * ポケモン図鑑機能 サービス
 */
@Injectable({
  providedIn: 'root',
})
export class PokedexManagementService {
  private pokemon_list: PokemonCardView[] = [];

  /**
   * コンストラクタ
   */
  constructor() {}

  /**
   * ポケモンリストを管理用変数へ格納する
   *
   * @param pokemon_list APIから取得したポケモンのリスト
   */
  setPokemonList(pokemon_list: PokemonCardView[]): void {
    this.pokemon_list = pokemon_list;
  }

  /**
   * 保持しているポケモンリストを取得する
   *
   * @returns {PokemonCardView}
   */
  getPokemonList(): PokemonCardView[] {
    return this.pokemon_list;
  }
}
