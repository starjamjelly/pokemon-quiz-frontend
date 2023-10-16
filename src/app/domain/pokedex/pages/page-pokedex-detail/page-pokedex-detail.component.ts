import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LoadingSpinnerService } from 'src/app/shared/services/loading-spinner.service';
import { InitPokedexDetail, PokedexClientService } from '../../service/pokedex-client.service';
import { FavoriteStateManagementService } from '../../../../shared/services/favorite-state-management.service';
import { PokedexManagementService } from '../../service/pokedex-management.service';
import { DlgSlideInService } from '../../../../shared/services/dlg-slide-in.service';
import { Type } from '../../../../shared/types/model-type';

class DummyInitPokedexDetail {
  pokedex_id: number = 0;
  pokemon_name: string = 'よみこみちゅう';
  image_path: string = '';
  genus: string = 'よみこみちゅう';
  characteristic: string = 'よみこみちゅう';
  is_favorite: boolean = false;
  types: Type[] = [];
}

/*
 * ポケモン図鑑詳細画面
 */
@Component({
  selector: 'app-page-pokedex-detail',
  templateUrl: './page-pokedex-detail.component.html',
  styleUrls: ['./page-pokedex-detail.component.scss'],
})
export class PagePokedexDetailComponent implements OnInit {
  public pokemon: InitPokedexDetail = new DummyInitPokedexDetail();
  public type_color_1: string = '';
  public type_color_2: string = '';

  /**
   * コンストラクタ
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pokedex_client_service: PokedexClientService,
    private pokedex_management_service: PokedexManagementService,
    private loading_spinner_service: LoadingSpinnerService,
    private favorite_state_management_service: FavoriteStateManagementService,
    private dlg_slide_in_service: DlgSlideInService
  ) {
    // 画面表示用データの取得・設定
    let id: number;
    this.route.params.subscribe((params) => (id = params['id']));
    this.setPokedexDetailData(id);
  }

  /**
   * コンポーネント生成時処理
   */
  ngOnInit(): void {}

  /**
   * ポケモン詳細画面 メイン画像読み込み終了時処理
   * - 画像の描画が終了したらローディングスピナーを閉じる
   * @returns {void}
   */
  handleCompleteDraw(): void {
    this.loading_spinner_service.hide();
  }

  /**
   * 前後遷移ボタン押下時処理
   * - ポケモン図鑑詳細ページを前後へ遷移させる
   * - 一覧画面での検索結果をもとにステップする
   *
   * @param {1|-1} move_step - 1:次へ|-1:前へ
   * @returns {void}
   */
  handleMoveDetail(move_step: 1 | -1): void {
    // 一覧画面での検索結果を取得
    const searched_pokemon_list = this.pokedex_management_service.getPokemonList();
    let next_idx: number | null = null;

    // 一覧画面での検索結果をもとにアクションを決定
    for (let idx = 0; idx < searched_pokemon_list.length; idx++) {
      if (searched_pokemon_list[idx].pokedex_id === this.pokemon.pokedex_id) {
        // 移動先のポケモンが一覧の先頭か末尾なら遷移しない
        if (searched_pokemon_list[idx + move_step] === undefined) {
          this.dlg_slide_in_service.showDlg('error_outline', 'これよりさきはすすめません');
          return;
        }

        // 図鑑情報の取得
        next_idx = idx + move_step;
        this.setPokedexDetailData(searched_pokemon_list[next_idx].pokedex_id);
        // 画面遷移
        this.router.navigate([`/pokedex/detail/${searched_pokemon_list[next_idx].pokedex_id}`]);
        break;
      }
    }

    // 一覧画面での検索結果に移動先のポケモンがいない場合はリダイレクト
    if (next_idx !== null) return;
    this.dlg_slide_in_service.showDlg('error_outline', 'ポケモンのデータをみれませんでした');
    this.router.navigate(['/pokedex']);
  }

  /**
   * ポケモン図鑑詳細情報を取得する
   *
   * @param {number} pokedex_id - 図鑑No
   */
  setPokedexDetailData(pokedex_id: number): void {
    this.loading_spinner_service.show();
    scrollTo(0, 0);
    this.pokedex_client_service.initDetail(pokedex_id).subscribe((pokemon) => {
      // 取得した詳細データを設定
      this.pokemon = pokemon;
      this.pokedex_client_service.setPokemonState(pokemon);
      this.favorite_state_management_service.setPokemonState(pokemon);
      // タイプの色を設定
      [this.type_color_1, this.type_color_2] = this.pokemon.types.map((type) => {
        return `#${type.color_code}`;
      });
    });
  }
}
