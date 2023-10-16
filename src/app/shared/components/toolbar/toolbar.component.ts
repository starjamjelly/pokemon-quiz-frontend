import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { DlgSlideInService } from '../../services/dlg-slide-in.service';

/*
 * ツールバー
 */
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  /**
   * コンストラクタ
   */
  constructor(private auth_service: AuthService, private dlg_slide_in_service: DlgSlideInService) {}

  /**
   * コンポーネント表示時処理
   */
  ngOnInit(): void {}

  /**
   * ログアウトボタン押下
   */
  handleLogout(): void {
    this.auth_service.logout();
    this.dlg_slide_in_service.showDlg('check_circle_outline', 'ログアウトに成功しました');
  }
}
