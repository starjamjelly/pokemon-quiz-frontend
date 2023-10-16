import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ProgressBarService } from '../../services/progress-bar.service';

/*
 * 問題進捗プログレスバー
 */
@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent implements OnInit {
  @Input() full_raito: number;
  @Input() active_raito: number;
  @Input() theme_color: 'default' | 'orange' = 'default';
  public disp_active_raito: Subject<string> = this.progress_bar_service.disp_active_raito;

  /**
   * コンストラクタ
   */
  constructor(public progress_bar_service: ProgressBarService) {}

  /**
   * 画面表示時処理
   */
  ngOnInit(): void {
    this.progress_bar_service.setActiveRaito(this.active_raito, this.full_raito);
  }
}
