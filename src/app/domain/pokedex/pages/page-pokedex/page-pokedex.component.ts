import { Component, OnInit } from '@angular/core';
import { trigger, transition, animate, keyframes, style } from '@angular/animations';
import { Router } from '@angular/router';

import {
  ARPokemon,
  ARMatchGenerationPokemon,
  InitPokedex,
  PokedexClientService,
  ARMatchNamePokemon,
} from '../../service/pokedex-client.service';
import { LoadingSpinnerService } from 'src/app/shared/services/loading-spinner.service';
import { ARAllFavoritePokemon } from '../../service/pokedex-client.service';
import { PokedexManagementService } from '../../service/pokedex-management.service';

export type PokemonCardView = Omit<ARPokemon, 'types'> & {
  color_1: string;
  color_2?: string;
};

type SearchTypeChip = {
  no: number;
  type_name: string;
  selected: boolean;
};

/*
 * ポケモン図鑑一覧画面
 */
@Component({
  selector: 'app-page-pokedex',
  templateUrl: './page-pokedex.component.html',
  styleUrls: ['./page-pokedex.component.scss'],
  animations: [
    // カードをフェードイン
    trigger('fadeIn', [
      transition(':enter', [
        animate(
          '0.4s',
          keyframes([
            style({
              opacity: '0',
              transform: 'translateY(10px)',
            }),
            style({
              opacity: '1',
              transform: 'translateY(0px)',
            }),
          ])
        ),
      ]),
    ]),
  ],
})
export class PagePokedexComponent implements OnInit {
  public window = window;
  public search_pokemon_name: string = '';
  public selected_generation: number = 1;
  public pokemons: PokemonCardView[] = [];
  public generations: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  public p: number = 1;
  public PAGINATION_SIZE: number = 5;
  public max_view_cnt: number = 20;
  public type_chip_list: SearchTypeChip[] = [
    { no: 1, type_name: 'せだい', selected: true },
    { no: 2, type_name: 'なまえ', selected: false },
    { no: 3, type_name: 'おきにいり', selected: false },
  ];
  public current_type_chip_no: number = 1;

  /**
   * コンストラクタ
   */
  constructor(
    private router: Router,
    private pokedex_client_service: PokedexClientService,
    private pokedex_management_service: PokedexManagementService,
    private loading_spinner_service: LoadingSpinnerService
  ) {
    this.max_view_cnt = innerWidth > 599 ? 100 : 20;
    for (let i = 0; i < this.max_view_cnt; i++) {
      this.pokemons = [
        ...this.pokemons,
        {
          pokedex_id: 0,
          pokemon_name: '',
          image_path: '../../../../../assets/images/dummy_gray.svg',
          color_1: '',
        },
      ];
    }
  }

  /**
   * コンポーネント生成時処理
   */
  ngOnInit(): void {
    this.loading_spinner_service.show();
    // 一覧表示用データの取得・設定
    const pokemons = this.pokedex_management_service.getPokemonList();
    if (pokemons.length) {
      // 検索結果があるならばそちらを優先して設定
      this.pokemons = pokemons;
      this.loading_spinner_service.hide();
      return;
    }
    this.pokedex_client_service.initList().subscribe((res: InitPokedex) => {
      // ポケモン一覧を取得してセット
      this.pokemons = [];
      this.pokemons = this.convARPokemonToCardView(res.pokemons);
      this.pokedex_management_service.setPokemonList(this.pokemons);
      this.loading_spinner_service.hide();
    });
  }

  /**
   * 図鑑詳細ページへ遷移する
   *
   * @param {number} pokedex_id - 遷移先の図鑑No
   */
  handleMoveDetailPage(pokedex_id: number): void {
    this.router.navigate([`/pokedex/detail/${pokedex_id}`]);
  }

  /**
   * 検索方式の選択時処理
   * - 選択状態を管理する
   *
   * @param select_no 選択された検索方式
   */
  handleSelectTypeChip(select_no: number): void {
    this.type_chip_list.forEach((item, idx) => {
      // クリックされたチップを選択状態にする
      if (item.no === select_no) {
        this.type_chip_list[idx].selected = true;
        this.current_type_chip_no = select_no;
      } else {
        this.type_chip_list[idx].selected = false;
      }

      // お気に入り表示チップがクリックされたなら、即座にリスト表示へ反映させる
      if (select_no === 3) {
        this.handleSearchFavoritePokemon();
      }
    });
  }

  /**
   * ポケモン名入力ボックスの値での検索ボタン押下時処理
   * - 入力された文字列を名前に含むポケモンの一覧を取得し表示する
   *
   * @param search_pokemon_name - 名前テキストボックスの値
   */
  handleSearchPokemonName(search_pokemon_name: string): void {
    this.loading_spinner_service.show();
    this.pokedex_client_service
      .getMatchNamePokemons(search_pokemon_name)
      .subscribe((res: ARMatchNamePokemon) => {
        this.pokemons = this.convARPokemonToCardView(res.pokemons);
        this.p = 1;
        this.loading_spinner_service.hide();
      });
  }

  /**
   * お気に入り表示チップ押下時処理
   * - 全てのお気に入りポケモンを取得し、リストへ反映させる
   *
   * @returns {void}
   */
  handleSearchFavoritePokemon(): void {
    this.loading_spinner_service.show();
    this.pokedex_client_service.getAllFavoritePokemon().subscribe((res: ARAllFavoritePokemon) => {
      this.pokemons = this.convARPokemonToCardView(res.pokemons);
      this.pokedex_management_service.setPokemonList(this.pokemons);
      this.p = 1;
      this.loading_spinner_service.hide();
    });
  }

  /**
   * ポケモン名入力ボックスの入力値を削除する
   *
   * @returns
   */
  handleCleanPokemonName(): void {
    this.search_pokemon_name = '';
  }

  /**
   * 世代選択プルダウン変更時処理
   * - 選択された世代情報を取得し表示する
   *
   * @param {number} $evenet - 世代セレクトボックスの値
   * @returns {void}
   */
  handleSelectGeneration($evenet: number): void {
    this.loading_spinner_service.show();
    this.pokedex_client_service
      .getMatchGenerationPokemons($evenet)
      .subscribe((res: ARMatchGenerationPokemon) => {
        this.pokemons = this.convARPokemonToCardView(res.pokemons);
        this.pokedex_management_service.setPokemonList(this.pokemons);
        this.selected_generation = $evenet;
        this.p = 1;
        this.loading_spinner_service.hide();
      });
  }

  /**
   * APIの返却値をリスト表示用配列へ変換する
   */
  convARPokemonToCardView(pokemon_list: ARPokemon[]): PokemonCardView[] {
    const viewable_pokemon_list = pokemon_list.map((item: ARPokemon) => {
      const pokemon: PokemonCardView = {
        pokedex_id: item.pokedex_id,
        pokemon_name: item.pokemon_name,
        image_path: item.image_path,
        color_1: `#${item.types[0].color_code}`,
        color_2: item.types[1] ? `#${item.types[1].color_code}` : `#${item.types[0].color_code}`,
      };
      return pokemon;
    });
    return viewable_pokemon_list;
  }
}
