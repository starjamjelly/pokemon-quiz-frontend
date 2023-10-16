import { Injectable } from '@angular/core';
import { Subject, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingSpinnerService {
  /** スピナーの表示、非表示フラグ */
  public is_loading: Subject<boolean> = new Subject<boolean>();

  constructor() {}

  /**
   * スピナーの表示
   */
  public show(): void {
    this.is_loading.next(true);
  }

  /**
   * スピナーの非表示
   */
  public hide(): void {
    this.is_loading.next(false);
  }

  /**
   * 指定時間だけスピナーを表示する
   */
  public showOnMs(delay_ms: number): void {
    this.show();

    const delay = timer(delay_ms);
    delay.subscribe((val) => this.hide());
  }
}
