import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'home',
        loadChildren: () => import('./home/home.module').then((n) => n.HomeModule),
    },
    {
        path: 'students',
        loadChildren: () => import('./users/users.module').then((n) => n.UsersModule),
    },
    {
        path: 'courses',
        loadChildren: () => import('./courses/courses.module').then((n) => n.CoursesModule),
    },
    {
        path: '**',
        redirectTo: 'home',
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
