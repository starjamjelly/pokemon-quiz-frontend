import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DlgSlideInService } from '../../../../shared/services/dlg-slide-in.service';

import {
  DlgVolumeSelectComponent,
  DialogResult,
} from 'src/app/shared/components/dlg-volume-select/dlg-volume-select.component';

type MenuBtn = {
  id: number;
  txt: string;
  linkto: string;
  query_params: {};
  disabled: boolean;
  style_ex_classes: string;
  img_path: string;
};

/*
 * トップ画面
 */
@Component({
  selector: 'app-page-top',
  templateUrl: './page-top.component.html',
  styleUrls: ['./page-top.component.scss'],
})
export class PageTopComponent implements OnInit {
  private selected_menu: MenuBtn | null = null;
  public menu_btns_state: MenuBtn[] = [
    {
      id: 1,
      txt: 'シルエットクイズ',
      linkto: '/silhouette-quiz',
      query_params: { quiz_kind: 'silhouette' },
      disabled: false,
      style_ex_classes: 'menu-btn__img-circle--yellow',
      img_path: '../../../../../assets/images/menu_btn_silhouette.svg',
    },
    {
      id: 2,
      txt: 'どでかクイズ',
      linkto: '/silhouette-quiz', // 暫定的にシルエットクイズモジュールで実装する。共通部品化は後程考える。
      query_params: { quiz_kind: 'biggest' },
      disabled: false,
      style_ex_classes: 'menu-btn__img-circle--blue',
      img_path: '../../../../../assets/images/menu_btn_biggest.svg',
    },
    {
      id: 3,
      txt: 'ポケモンずかん',
      linkto: '/pokedex',
      query_params: {},
      disabled: false,
      style_ex_classes: 'menu-btn__img-circle--red',
      img_path: '../../../../../assets/images/menu_btn_pokedex.svg',
    },
    {
      id: 4,
      txt: 'せってい',
      linkto: '',
      query_params: {},
      disabled: true,
      style_ex_classes: 'menu-btn__img-circle--green',
      img_path: '../../../../../assets/images/menu_btn_setting.svg',
    },
  ];

  /**
   * コンストラクタ
   */
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private dlg_slide_in_service: DlgSlideInService
  ) {}

  /**
   * コンポーネント表示時処理
   */
  ngOnInit(): void {}

  /**
   * トップメニューから機能遷移ボタンの押下時処理
   *
   * @param {MenuBtn} menu_btn - メニューボタンオブジェクト
   * @returns {void}
   */
  handleMenuSelect(menu_btn: MenuBtn): void {
    // 選択状態を更新
    this.selected_menu = menu_btn;

    // 選択結果ごとの処理
    switch (menu_btn.id) {
      case 1:
      case 2:
        this.openDialog(`${menu_btn.linkto}`);
        break;
      default:
        const query_params = { queryParams: menu_btn.query_params };
        this.router.navigate([`${menu_btn.linkto}`], query_params);
        break;
    }
  }

  /**
   * ダイアログオープン
   *
   * @param {string} path - 遷移先のパス
   * @return {void}
   */
  openDialog(path: string): void {
    // ダイアログ設定
    const dialogRef = this.dialog.open(DlgVolumeSelectComponent, {
      disableClose: true,
      data: { path },
    });

    // ダイアログが閉じられたことを検知
    dialogRef.afterClosed().subscribe((result: DialogResult) => {
      if (result.state === 'select') {
        // メニューボタンが未選択状態ならエラー
        if (this.selected_menu === null) {
          this.dlg_slide_in_service.showDlg('error_outline', 'がめんをいどうできませんでした');
          return;
        }

        // 画面遷移
        this.router.navigate([path], {
          queryParams: {
            quiz_kind: this.selected_menu.query_params['quiz_kind'],
            volume: result.volume,
          },
        });
      }
    });
  }
}
