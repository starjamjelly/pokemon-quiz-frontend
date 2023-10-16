import { trigger, transition, animate, keyframes, style } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/shared/services/auth.service';
import { DlgSlideInService } from 'src/app/shared/services/dlg-slide-in.service';

type Signup = {
  username: string;
  password: string;
  confirm_password: string;
};

/**
 * パスワードと確認用パスワードが一致しているか確認するバリデーター
 *
 * @returns
 */
const matchPasswordConfirmValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const password_confirm = control.get('password_confirm');

  if (password === null || password_confirm === null) {
    return null;
  }

  return password.errors !== null || password.value === password_confirm.value
    ? null
    : { unmatchPassword: true };
};

@Component({
  selector: 'app-page-signup',
  templateUrl: './page-signup.component.html',
  styleUrls: ['./page-signup.component.scss'],
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
export class PageSignupComponent implements OnInit {
  // フォームの入力文字数制限
  public form_maxlength: 20 = 20;

  // フォームコントロールオブジェクト
  public username_ctrl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[0-9a-zA-Z]+$/),
  ]);
  public password_ctrl = new FormControl('', [Validators.required]);
  public password_confirm_ctrl = new FormControl('', [Validators.required]);
  public userRegistForm = new FormGroup(
    {
      username: this.username_ctrl,
      password: this.password_ctrl,
      password_confirm: this.password_confirm_ctrl,
    },
    {
      validators: [matchPasswordConfirmValidator],
    }
  );

  // エラーメッセージ
  public error_msg: { username: string; password: string; password_confirm: string } = {
    username: '',
    password: '',
    password_confirm: '',
  };
  public clean_error_msg: typeof this.error_msg = {
    username: '',
    password: '',
    password_confirm: '',
  };

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
   * サインアップ機能
   * - ユーザーを作成する
   *
   * @param {FormGroup} signup_form - サインアップフォームオブジェクト
   * @returns {void}
   */
  handleSignup(signup_form: FormGroup): void {
    // エラーチェック実行
    this.show_error_msg = false;
    const is_error = this.isErrorAndSetErrorMessage();

    if (!is_error) {
      // サインアップパラメータセット
      const signup_params: Signup = signup_form.value;

      // サインアップ実行
      this.auth_service.signup(signup_params).subscribe({
        next: (is_signup: boolean) => {
          if (is_signup) {
            this.dlg_slide_in_service.showDlg('check_circle_outline', '登録に成功しました');
            this.router.navigate(['/login']);
          } else {
            this.dlg_slide_in_service.showDlg('error_outline', '登録できませんでした');
          }
        },
        error: (err) => {
          this.dlg_slide_in_service.showDlg('error_outline', '登録できませんでした');
        },
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
   * ログインページへ遷移する
   *
   * @returns {void}
   */
  handleMoveSignupPage(): void {
    this.router.navigate(['/login']);
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
    // -- パスワード（確認用）
    if (this.password_confirm_ctrl.hasError('required')) {
      is_error = true;
      this.error_msg.password_confirm = '必須入力です';
    }
    if (this.userRegistForm.errors?.['unmatchPassword']) {
      is_error = true;
      this.error_msg.password_confirm = '入力値がパスワードと違います';
    }

    return is_error;
  }
}
