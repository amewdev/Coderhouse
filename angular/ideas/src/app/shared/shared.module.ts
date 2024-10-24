import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UserFullNamePipe } from './pipes/user-full-name.pipe';
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
    MatTableModule,
    MatProgressSpinnerModule,
    UserFullNamePipe,
    Fontsize20Directive,
  ]
})
export class SharedModule { }
