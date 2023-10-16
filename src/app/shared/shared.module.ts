import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CopylightComponent } from './components/copylight/copylight.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BackBtnComponent } from './components/back-btn/back-btn.component';
import { RouterModule } from '@angular/router';
import { TitleWithinDividerComponent } from './components/title-within-divider/title-within-divider.component';
import { FavoriteBtnComponent } from './components/favorite-btn/favorite-btn.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { MatCardModule } from '@angular/material/card';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenIntercepter } from './Intercepters/token.intercepter';
import { AuthGuard } from './guards/auth.guard';
import { DlgVolumeSelectComponent } from './components/dlg-volume-select/dlg-volume-select.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { DlgSlideInComponent } from './components/dlg-slide-in/dlg-slide-in.component';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
  declarations: [
    CopylightComponent,
    ToolbarComponent,
    BackBtnComponent,
    TitleWithinDividerComponent,
    FavoriteBtnComponent,
    LoadingSpinnerComponent,
    DlgVolumeSelectComponent,
    ProgressBarComponent,
    DlgSlideInComponent,
  ],
  imports: [
    // Built-in
    CommonModule,
    RouterModule,
    FormsModule,
    // Third-party
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatToolbarModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatFormFieldModule,
    MatRadioModule,
    MatDialogModule,
    MatMenuModule,
    MatRippleModule,
  ],
  exports: [
    CopylightComponent,
    ToolbarComponent,
    BackBtnComponent,
    FavoriteBtnComponent,
    TitleWithinDividerComponent,
    LoadingSpinnerComponent,
    DlgVolumeSelectComponent,
    ProgressBarComponent,
    DlgSlideInComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenIntercepter,
      multi: true,
    },
    AuthGuard,
  ],
})
export class SharedModule {}
