import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PokedexModule } from './pokedex/pokedex.module';
import { TopModule } from './top/top.module';
import { SharedModule } from '../shared/shared.module';
import { SilhouetteQuizModule } from './silhouette-quiz/silhouette-quiz.module';
import { AccountModule } from './account/login.module';

@NgModule({
  declarations: [],
  imports: [
    // Built-in
    CommonModule,
    // Local
    AccountModule,
    TopModule,
    PokedexModule,
    SilhouetteQuizModule,
    SharedModule,
  ],
})
export class DomainModule {}
