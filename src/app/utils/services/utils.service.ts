import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  /**
   * 変数が定義されているかを確認する
   *
   * @param {any} val - 確認したい値
   * @returns {boolean}
   */
  isSet(val: any): boolean {
    const val_type = typeof val;
    if(val_type == null) {
      return false;
    }
    return true;
  }

  /**
   * 与えられた配列の並び順をシャッフルする
   *
   * @param {any[]} list - 並び替えたい配列
   * @returns {any[]}
   */
  shuffle(list: any[]): any[] {
    let clone_list: any[] = [...list];
    for (let i = clone_list.length - 1; i >= 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1))
      const wk = clone_list[i]
      clone_list[i] = clone_list[rand]
      clone_list[rand] = wk
    }
    return clone_list;
  }
}
