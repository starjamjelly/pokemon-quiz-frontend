import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

export type DialogResult = {
  state: 'select' | 'cancel';
  volume?: 1 | 5 | 20;
};

/*
 * 問題数選択ダイアログ
 */
@Component({
  selector: 'app-dlg-volume-select',
  templateUrl: './dlg-volume-select.component.html',
  styleUrls: ['./dlg-volume-select.component.scss'],
})
export class DlgVolumeSelectComponent implements OnInit {
  public choice_volume: 1 | 5 | 20;
  public volumes: number[] = [1, 5, 20];

  /**
   * コンストラクタ
   */
  constructor(public dialogRef: MatDialogRef<DlgVolumeSelectComponent>) {}

  /**
   * コンポーネント表示時処理
   */
  ngOnInit(): void {}

  /**
   * ダイアログを閉じるボタンをクリックされた
   * @return {void}
   */
  handleCancel(): void {
    const res: DialogResult = { state: 'cancel' };
    this.dialogRef.close(res);
  }

  /**
   * ダイアログのOKボタンがクリックされた
   * @param {1 | 5 | 20} volume - 問題数
   */
  handleSelectVolume(volume: 1 | 5 | 20): void {
    const res: DialogResult = { state: 'select', volume: volume };
    this.dialogRef.close(res);
  }
}
