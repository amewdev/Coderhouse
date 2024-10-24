import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { DashboardModule } from './features/dashboard/dashboard.module';
import { UsersModule } from './features/dashboard/users/users.module';
import { UsersComponent } from './features/dashboard/users/users.component';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        loadChildren: () => DashboardModule,
    },
    {
        path: 'students',
        component: UsersComponent,
        loadChildren: () => UsersModule,
    },
    {
        path: '**',
        redirectTo: '',
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
