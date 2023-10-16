import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { Answer, Choice, Question } from 'src/app/shared/types/type';
import { QuestionClientService } from '../../../../shared/services/question-client.service';
import { UtilsService } from 'src/app/utils/services/utils.service';
import { StorageAnswerService } from 'src/app/shared/services/storage-answer.service';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { trigger, transition, animate, keyframes, style, state } from '@angular/animations';
import { DlgSlideInService } from '../../../../shared/services/dlg-slide-in.service';
import { LoadingSpinnerService } from '../../../../shared/services/loading-spinner.service';

// 問題初期化用クラス
class QuestionInit {
  pokedex_id: number;
  pokemon_name: string;
  genus: string;
  characteristic: string;
  image_path: string;
  dummys: Choice[];
}

/*
 * シルエットクイズ画面
 */
@Component({
  selector: 'app-page-silhouette-quiz',
  templateUrl: './page-silhouette-quiz.component.html',
  styleUrls: ['./page-silhouette-quiz.component.scss'],
  animations: [
    // カルーセルのスクロール時にページをフェードする
    trigger('slideInCaroucel', [
      state('open', style({ opacity: '1' })),
      state('close', style({ opacity: '0' })),
      transition('close => open', [
        animate(
          '0.3s',
          keyframes([style({ opacity: '0', offset: 0 }), style({ opacity: '1', offset: 1 })])
        ),
      ]),
      transition('open => close', [
        animate(
          '0.3s',
          keyframes([style({ opacity: '1', offset: 0 }), style({ opacity: '0', offset: 1 })])
        ),
      ]),
    ]),
  ],
})
export class PageSilhouetteQuizComponent implements OnInit {
  // クイズの種類
  public quiz_kind: 'silhouette' | 'biggest';

  // クイズの問題数
  public volume: 1 | 5 | 20 = 1;

  // クイズの問題配列
  public question_list: Question[] = [];

  // 現在表示中の問題
  public current_question: Question = new QuestionInit();

  // 現在表示中の問題の番号
  public question_num: number = 1;

  // 現在表示中の問題の選択肢
  public choice_btn_list: Choice[] = [];

  // 現在表示中の問題が回答済みかどうか
  public is_choiced: boolean = false;

  // クイズの回答状況
  public answered_list: Answer[] = [];

  // 現在表示中の問題の回答後カルーセルでどのページが表示中か
  public caroucel_page_list = ['page1', 'page2'] as const;
  public current_show_caroucel: (typeof this.caroucel_page_list)[number] | 'none' = 'page1';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private question_client_service: QuestionClientService,
    private storage_answer_service: StorageAnswerService,
    private progress_bar_service: ProgressBarService,
    public utils_service: UtilsService,
    public dlg_slide_in_service: DlgSlideInService,
    private loading_spinner_service: LoadingSpinnerService
  ) {}

  ngOnInit(): void {
    // クイズ配列を取得
    this.loading_spinner_service.show();
    this.activatedRoute.queryParams
      .pipe(
        map((params) => {
          // クイズの種類を取得
          this.quiz_kind = params['quiz_kind'];

          // 問題を取得
          this.volume = params['volume'];
          return this.question_client_service
            .getQuestion('silhouette-quiz', this.volume)
            .subscribe((question_list: Question[]) => {
              // 取得した問題リストを格納
              this.question_list = question_list;
              // 現在表示中の問題に1問目をセット
              this.changeCurrentQuestionView(this.question_num);
            });
        })
      )
      .subscribe();
  }

  /**
   * ポケモン名ボタン押下
   */
  handleEchoName(pokemon_name: string): void {
    // ブラウザにWeb Speech API Speech Synthesis機能があるか判定
    if ('speechSynthesis' in window) {
      // 発言を設定
      const uttr = new SpeechSynthesisUtterance();
      uttr.text = pokemon_name;
      // 言語を設定
      uttr.lang = 'ja-JP';
      // 速度を設定
      uttr.rate = 0.8;
      // 発言を再生
      window.speechSynthesis.speak(uttr);
    } else {
      this.dlg_slide_in_service.showDlg('error_outline', '読み上げに対応していないブラウザです。');
    }
  }

  /**
   * クイズの回答選択ボタンを押下
   *
   * @param {number} choice_pokedex_id - 選択されたポケモンのID
   * @param {string} choice_pokemon_name - 選択されたポケモンの名前
   * @returns {void}
   */
  handleClickChoiceBtn(choice_pokedex_id: number, choice_pokemon_name: string): void {
    // 回答状況を更新
    this.is_choiced = true;
    const current_answer_state: Answer = {
      question_num: this.question_num,
      choice_pokedex_id: choice_pokedex_id,
      choice_pokemon_name: choice_pokemon_name,
      correct_pokedex_id: this.current_question.pokedex_id,
      correct_pokemon_name: this.current_question.pokemon_name,
      image_path: this.current_question.image_path,
      is_correct: choice_pokedex_id === this.current_question.pokedex_id,
    };
    this.answered_list = [...this.answered_list, current_answer_state];

    // 正解・不正解を通知
    if (current_answer_state.is_correct) {
      this.dlg_slide_in_service.showDlg('check_circle_outline', 'だいせいかい🎉🎉', 'top');
    } else {
      this.dlg_slide_in_service.showDlg('error_outline', 'はずれ🌀', 'top');
    }
    return;
  }

  /**
   * カルーセルのスクロール時処理
   *
   * @param {any} e - スクロールイベントオブジェクト
   * @returns {void}
   */
  handleScrollCaroucel(e: any): void {
    // スクロール量に応じて表示中ページを変更
    if (e.target.clientWidth * 0.25 >= e.target.scrollLeft) {
      this.current_show_caroucel = 'page1';
    } else if (e.target.clientWidth * 0.75 <= e.target.scrollLeft) {
      this.current_show_caroucel = 'page2';
    } else {
      this.current_show_caroucel = 'none';
    }
  }

  /**
   * 次の問題へ進むボタンの押下時処理
   * - 問題内容を更新する
   *
   * @returns {void}
   */
  handleClickNextBtn(): void {
    // 最終問題か判断
    if (this.is_choiced && this.question_num < this.volume) {
      // カルーセルの表示をリセットする
      this.loading_spinner_service.show();
      scrollTo(0, 0);
      this.current_show_caroucel = 'page1';
      // 問題を1問分進める
      this.is_choiced = false;
      this.question_num++;
      // 現在表示中の問題を更新
      this.changeCurrentQuestionView(this.question_num);
      // プログレスバー更新
      this.progress_bar_service.setActiveRaito(this.question_num - 1, this.volume);
    } else {
      // 回答画面へ遷移する
      this.storage_answer_service.setAnsweredList(this.answered_list);
      this.router.navigate(['/silhouette-quiz/result-summary']);
    }
    return;
  }

  /**
   * クイズを終了してトップページへ戻る
   *
   * @returns {void}
   */
  handleClickCancelGame(): void {
    this.router.navigate(['/']);
  }

  /**
   * シルエットクイズ画面 メイン画像読み込み終了時処理
   * - 画像の描画が終了したらローディングスピナーを閉じる
   * @returns {void}
   */
  handleCompleteDraw(): void {
    this.loading_spinner_service.hide();
  }

  /**
   * 現在表示中の問題を更新する
   *
   * @param {number} question_num - 変更先の問題番号
   * @returns {void}
   */
  changeCurrentQuestionView(question_num: number): void {
    // 問題をセット
    this.current_question = this.question_list[question_num - 1];
    // 問題の選択肢をセット
    const correct_choice_btn: Choice = {
      pokedex_id: this.current_question.pokedex_id,
      pokemon_name: this.current_question.pokemon_name,
    };
    this.choice_btn_list = this.utils_service.shuffle([
      correct_choice_btn,
      ...this.current_question.dummys,
    ]);
    return;
  }
}
