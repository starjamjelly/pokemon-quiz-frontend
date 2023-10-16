import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

import { DlgSlideInService } from '../../services/dlg-slide-in.service';

/*
 * モバイル風通知ダイアログ
 */
@Component({
  selector: 'app-dlg-slide-in',
  templateUrl: './dlg-slide-in.component.html',
  styleUrls: ['./dlg-slide-in.component.scss'],
  animations: [
    trigger('slideIn', [
      state('hide', style({ opacity: '0' })),
      state('show', style({ opacity: '0' })),
      transition('hide => show', [
        animate(
          '4s',
          keyframes([
            style({ opacity: '0', offset: 0 }),
            style({ opacity: '1', offset: 0.05 }),
            style({ opacity: '1', offset: 0.9 }),
            style({ opacity: '0', offset: 1 }),
          ])
        ),
      ]),
    ]),
  ],
})
export class DlgSlideInComponent implements OnInit {
  /**
   * コンストラクタ
   */
  constructor(public dlg_slide_in_service: DlgSlideInService) {}

  /**
   * コンポーネント表示時処理
   */
  ngOnInit(): void {}
}
