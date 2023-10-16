import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageLoginComponent } from './domain/account/pages/page-login/page-login.component';
import { PageSignupComponent } from './domain/account/pages/page-signup/page-signup.component';
import { PagePokedexDetailComponent } from './domain/pokedex/pages/page-pokedex-detail/page-pokedex-detail.component';
import { PagePokedexComponent } from './domain/pokedex/pages/page-pokedex/page-pokedex.component';
import { PageSilhouetteQuizResultSummaryComponent } from './domain/silhouette-quiz/pages/page-silhouette-quiz-result-summary/page-silhouette-quiz-result-summary.component';
import { PageSilhouetteQuizComponent } from './domain/silhouette-quiz/pages/page-silhouette-quiz/page-silhouette-quiz.component';
import { PageTopComponent } from './domain/top/pages/page-top/page-top.component';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: PageTopComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'signup',
    component: PageSignupComponent,
  },
  {
    path: 'login',
    component: PageLoginComponent,
  },
  {
    path: 'pokedex',
    component: PagePokedexComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'pokedex/detail/:id',
    component: PagePokedexDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'silhouette-quiz',
    component: PageSilhouetteQuizComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'silhouette-quiz/result-summary',
    component: PageSilhouetteQuizResultSummaryComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
