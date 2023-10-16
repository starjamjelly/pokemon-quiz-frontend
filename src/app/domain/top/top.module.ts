import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRippleModule } from '@angular/material/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { PageTopComponent } from './pages/page-top/page-top.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [PageTopComponent],
  imports: [
    // Built-in
    CommonModule,
    RouterModule,
    // Third-party
    FlexLayoutModule,
    MatButtonModule,
    MatDividerModule,
    MatCardModule,
    MatDialogModule,
    MatRippleModule,
    // Local
    SharedModule,
  ],
})
export class TopModule {}
