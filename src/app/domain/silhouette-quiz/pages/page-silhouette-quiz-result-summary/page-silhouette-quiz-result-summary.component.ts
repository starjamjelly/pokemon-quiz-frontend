import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';

import { StorageAnswerService } from 'src/app/shared/services/storage-answer.service';
import { Answer } from 'src/app/shared/types/type';

/*
 * シルエットクイズ結果画面
 */
@Component({
  selector: 'app-page-silhouette-quiz-result-summary',
  templateUrl: './page-silhouette-quiz-result-summary.component.html',
  styleUrls: ['./page-silhouette-quiz-result-summary.component.scss'],
})
export class PageSilhouetteQuizResultSummaryComponent implements OnInit {
  public answered_list: Answer[] = [];
  public correct_point: number = 0;
  public fail_point: number = 0;

  public chartType: ChartType = 'doughnut';
  public chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    cutout: '90%',
  };
  public chartLabels: string[] = ['せいかい', 'はずれ'];
  public chartLegend: boolean = false;
  public chartDatasets: ChartDataset<'doughnut', number[]>[] = [
    { data: [0, 0], backgroundColor: ['#86e79e', '#e79686'] },
  ];

  /**
   * コンストラクタ
   */
  constructor(private router: Router, private storage_answer_service: StorageAnswerService) {}

  /**
   * コンポーネント表示時処理
   */
  ngOnInit(): void {
    // 回答状況取得
    this.answered_list = this.storage_answer_service.getAnsweredList();

    // Chart.jsに値をセット
    let correct_point = 0;
    let fail_point = 0;
    this.answered_list.forEach((answer_state) => {
      if (answer_state.is_correct) {
        correct_point++;
        return;
      }
      fail_point++;
    });
    this.chartDatasets[0].data = [correct_point, fail_point];
    this.correct_point = correct_point;
    this.fail_point = fail_point;

    // 回答がないならトップページへリダイレクト
    if (this.answered_list.length === 0) {
      this.router.navigate(['/']);
    }
  }

  /**
   * トップページへ戻るボタン押下
   *
   * @returns {void}
   */
  handleClickBackBtn(): void {
    this.router.navigate(['/']);
  }
}
