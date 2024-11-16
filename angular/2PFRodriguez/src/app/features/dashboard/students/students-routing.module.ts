import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentDetailComponent } from './student-detail/student-detail.component';
import { StudentsComponent } from './students.component';

const routes: Routes = [
    {
        path: '',
        component: StudentsComponent,
    },
    {
        path: ':id/detail',
        component: StudentDetailComponent,
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentsRoutingModule { }
