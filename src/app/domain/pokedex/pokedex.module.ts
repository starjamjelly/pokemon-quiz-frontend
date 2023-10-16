import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxPaginationModule } from 'ngx-pagination';

import { PagePokedexComponent } from './pages/page-pokedex/page-pokedex.component';
import { PagePokedexDetailComponent } from './pages/page-pokedex-detail/page-pokedex-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UtilsModule } from 'src/app/utils/utils.module';

@NgModule({
  declarations: [PagePokedexComponent, PagePokedexDetailComponent],
  imports: [
    // Built-in
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    // Third-party
    MatSelectModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatCardModule,
    MatRippleModule,
    MatChipsModule,
    MatInputModule,
    FlexLayoutModule,
    NgxPaginationModule,
    // Local
    SharedModule,
    UtilsModule,
  ],
})
export class PokedexModule {}
