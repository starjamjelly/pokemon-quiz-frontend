import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';

import { AuthService } from 'src/app/shared/services/auth.service';
import { DlgSlideInService } from 'src/app/shared/services/dlg-slide-in.service';

type Login = {
  username: string;
  password: string;
};

/*
 * ログイン画面
 */
@Component({
  selector: 'app-page-login',
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.scss'],
  animations: [
    // エラーメッセージをシェイクする
    trigger('errorShake', [
      transition(':enter', [
        animate(
          '0.4s',
          keyframes([
            style({ transform: 'translate(15px, 3px)' }),
            style({ transform: 'translate(-15px, 3px)' }),
            style({ transform: 'translate(15px, 3px)' }),
            style({ transform: 'translate(-15px, 3px)' }),
            style({ transform: 'translate(8px, 3px)' }),
            style({ transform: 'translate(0px, 3px)' }),
          ])
        ),
      ]),
    ]),
  ],
})
export class PageLoginComponent implements OnInit {
  // フォームの入力文字数制限
  public form_maxlength: 20 = 20;

  // フォームコントロールオブジェクト
  public username_ctrl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[0-9a-zA-Z]+$/),
  ]);
  public password_ctrl = new FormControl('', [Validators.required]);
  public userLoginForm = new FormGroup({
    username: this.username_ctrl,
    password: this.password_ctrl,
  });

  // エラーメッセージ
  public error_msg: { username: string; password: string } = { username: '', password: '' };
  public clean_error_msg: typeof this.error_msg = { username: '', password: '' };

  // エラーメッセージ表示フラグ
  public show_error_msg: boolean = false;

  /**
   * コンストラクタ
   */
  constructor(
    private auth_service: AuthService,
    private router: Router,
    private dlg_slide_in_service: DlgSlideInService
  ) {}

  /**
   * コンポーネント生成時処理
   */
  ngOnInit(): void {}

  /**
   * ログイン機能
   *
   * @param {FormGroup} login_form - ログインフォームオブジェクト
   * @returns {void}
   */
  handleLogin(login_form: FormGroup): void {
    // エラーチェック実行
    this.show_error_msg = false;
    const is_error = this.isErrorAndSetErrorMessage();

    if (!is_error) {
      // ログインパラメータセット
      const login_params: Login = login_form.value;

      // ログイン実行
      this.auth_service.login(login_params).subscribe((is_login: boolean) => {
        if (is_login) {
          this.router.navigate(['/']);
          this.dlg_slide_in_service.showDlg('check_circle_outline', 'ログインに成功しました');
        } else {
          this.dlg_slide_in_service.showDlg('error_outline', 'ログインできませんでした');
        }
      });
    } else {
      // エラーを通知する
      this.dlg_slide_in_service.showDlg('error_outline', '入力項目にエラーがあります');
      setTimeout(() => {
        this.show_error_msg = true;
      }, 1);
    }
  }

  /**
   * サインアップページへ遷移する
   *
   * @returns {void}
   */
  handleMoveSignupPage(): void {
    this.router.navigate(['/signup']);
  }

  /**
   * 入力値のバリデーションチェックを実行
   * - エラーメッセージを返却
   *
   * @returns {boolean}
   */
  isErrorAndSetErrorMessage(): boolean {
    // エラーチェック実行準備
    let is_error: boolean = false;
    this.error_msg = { ...this.clean_error_msg };

    // エラーチェック実行
    // -- ユーザーネーム
    if (this.username_ctrl.hasError('pattern')) {
      is_error = true;
      this.error_msg.username = '英数字のみが使用できます';
    }
    if (this.username_ctrl.hasError('required')) {
      is_error = true;
      this.error_msg.username = '必須入力です';
    }
    // -- パスワード
    if (this.password_ctrl.hasError('required')) {
      is_error = true;
      this.error_msg.password = '必須入力です';
    }

    return is_error;
  }
}
