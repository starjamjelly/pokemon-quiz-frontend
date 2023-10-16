import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DlgSlideInService {
  public slideIn: 'hide' | 'show' = 'hide';
  public icon: 'check_circle_outline' | 'error_outline' = 'check_circle_outline';
  public text: string = '';
  public position: 'top' | 'bottom' = 'bottom';

  constructor() {}

  /**
   * ダイアログの表示有無を取得する
   */
  getShowStatus(): typeof this.slideIn {
    return this.slideIn;
  }

  /**
   * ダイアログに表示するMUIのアイコン名を取得する
   */
  getIcon(): typeof this.icon {
    return this.icon;
  }

  /**
   * ダイアログに表示するメッセージを取得する
   */
  getText(): typeof this.text {
    return this.text;
  }

  /**
   * ダイアログに表示するメッセージを取得する
   */
  getPosition(): typeof this.position {
    return this.position;
  }

  /**
   * ダイアログを表示する(4000ms)
   *
   * @param icon MUIアイコン名
   * @param text 表示メッセージ文字列
   */
  showDlg(icon: typeof this.icon, text: string, position: typeof this.position = 'bottom'): void {
    if (this.slideIn !== 'show') {
      this.slideIn = 'show';
      this.icon = icon;
      this.text = text;
      this.position = position;
      setTimeout(() => {
        this.slideIn = 'hide';
      }, 4000);
    }
  }
}
