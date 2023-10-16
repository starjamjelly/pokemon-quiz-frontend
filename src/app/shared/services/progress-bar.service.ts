import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProgressBarService {
  public disp_active_raito: Subject<string> = new Subject<string>();

  constructor() {}

  /**
   * ドーナツグラフの活性化領域を計算し、パーセンテージとしてセットする
   *
   * @param {number} active_raito
   * @param {number} full_raito
   */
  setActiveRaito(active_raito: number, full_raito: number) {
    this.disp_active_raito.next(((active_raito / full_raito) * 100).toString() + '%');
  }
}
