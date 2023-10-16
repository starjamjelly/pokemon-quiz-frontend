import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/*
 * 戻るボタン（画面右下フロート）
 */
@Component({
  selector: 'app-back-btn',
  templateUrl: './back-btn.component.html',
  styleUrls: ['./back-btn.component.scss'],
})
export class BackBtnComponent implements OnInit {
  @Input() is_float: boolean = true;
  @Input() color: string = '#FFEDBF';
  @Input() back_url: string = '';

  /**
   * コンストラクタ
   */
  constructor(private router: Router) {}

  /**
   * コンポーネント表示時処理
   */
  ngOnInit(): void {}

  /**
   * 指定されたページに戻る
   */
  handleBackPage(): void {
    this.router.navigate([this.back_url]);
  }
}
