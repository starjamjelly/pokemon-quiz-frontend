import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

import { PageLoginComponent } from './pages/page-login/page-login.component';
import { PageSignupComponent } from './pages/page-signup/page-signup.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [PageLoginComponent, PageSignupComponent],
  imports: [
    // Built-in
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Third-party
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    // Local
    SharedModule,
  ],
})
export class AccountModule {}
