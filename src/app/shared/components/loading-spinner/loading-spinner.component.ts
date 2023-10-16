import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { LoadingSpinnerService } from '../../services/loading-spinner.service';

/*
 * ローディングスピナー
 */
@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
})
export class LoadingSpinnerComponent implements OnInit {
  // スピナーの表示、非表示フラグ
  public is_loading: Subject<boolean> = this.loading_spinner_service.is_loading;

  /**
   * コンストラクタ
   */
  constructor(private loading_spinner_service: LoadingSpinnerService) {}

  /**
   * 画面表示時処理
   */
  ngOnInit(): void {}
}
