import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { UserFullNamePipe } from './pipes/user-full-name.pipe';
import { MatDialogModule } from '@angular/material/dialog';
import { Fontsize20Directive } from './directives/fontsize20.directive';

@NgModule({
  declarations: [
    UserFullNamePipe,
    Fontsize20Directive,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatTableModule,
    UserFullNamePipe,
    Fontsize20Directive,
  ]
})
export class SharedModule { }
