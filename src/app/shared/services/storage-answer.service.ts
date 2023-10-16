import { Injectable } from '@angular/core';
import { Answer } from '../types/type';

@Injectable({
  providedIn: 'root',
})
export class StorageAnswerService {
  public answered_list: Answer[] = [];

  constructor() {}

  /**
   * 引数に受け取った回答状態をセットする
   * - 結果表示画面への受け渡し用
   *
   * @param {Answer[]} answer_list - 回答状態を保持する配列
   * @returns {void}
   */
  setAnsweredList(answered_list: Answer[]): void {
    this.answered_list = answered_list;
  }

  /**
   * セットされている回答状態を返却する
   * - 結果表示画面からの取得用
   *
   * @returns {Answer[]}
   */
  getAnsweredList(): Answer[] {
    return this.answered_list;
  }
}
