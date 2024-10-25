import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { DashboardModule } from './features/dashboard/dashboard.module';

const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        loadChildren: () => DashboardModule,
    },
    {
        path: '**',
        redirectTo: 'dashboard',
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
