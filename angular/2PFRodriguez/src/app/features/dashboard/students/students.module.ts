import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentsRoutingModule } from './students-routing.module';
import { StudentsComponent } from './students.component';
import { SharedModule } from '../../../shared/shared.module';
import { StudentDialogComponent } from './student-dialog/student-dialog.component';
import { StudentDetailComponent } from './student-detail/student-detail.component';


@NgModule({
  declarations: [
    StudentsComponent,
    StudentDialogComponent,
    StudentDetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    StudentsRoutingModule
  ],
  exports: [
    StudentsComponent,
  ]
})
export class StudentsModule { }
