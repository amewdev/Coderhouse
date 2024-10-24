import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'home',
        loadChildren: () => import('./home/home.module').then((n) => n.HomeModule),
    },
    {
        path: 'users',
        loadChildren: () => import('./users/users.module').then((n) => n.UsersModule),
    },
    {
        path: 'categories',
        loadChildren: () => import('./categories/categories.module').then((n) => n.CategoriesModule),
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
