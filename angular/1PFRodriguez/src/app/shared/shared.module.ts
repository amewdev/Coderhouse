import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
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
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    UserFullNamePipe,
    Fontsize20Directive,
  ]
})
export class SharedModule { }
