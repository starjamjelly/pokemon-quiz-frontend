import { Component, Input, OnInit } from '@angular/core';

/*
 * タイトル付き区切り線
 */
@Component({
  selector: 'app-title-within-divider',
  templateUrl: './title-within-divider.component.html',
  styleUrls: ['./title-within-divider.component.scss'],
})
export class TitleWithinDividerComponent implements OnInit {
  @Input() icon: string;
  @Input() title: string;

  /**
   * コンストラクタ
   */
  constructor() {}

  /**
   * コンポーネント表示時処理
   */
  ngOnInit(): void {}
}
