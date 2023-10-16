import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';

import { PageSilhouetteQuizComponent } from './pages/page-silhouette-quiz/page-silhouette-quiz.component';
import { PageSilhouetteQuizResultSummaryComponent } from './pages/page-silhouette-quiz-result-summary/page-silhouette-quiz-result-summary.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [PageSilhouetteQuizComponent, PageSilhouetteQuizResultSummaryComponent],
  imports: [
    // Built-in
    CommonModule,
    RouterModule,
    // Third-party
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatRippleModule,
    NgChartsModule,
    // Local
    SharedModule,
  ],
})
export class SilhouetteQuizModule {}
