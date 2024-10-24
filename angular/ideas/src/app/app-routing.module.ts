import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './features/auth/auth.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AuthModule } from './features/auth/auth.module';
import { DashboardModule } from './features/dashboard/dashboard.module';

const routes: Routes = [
    {
        path: 'auth',
        component: AuthComponent,
        loadChildren: () => AuthModule,
        //children: [
        //    {
        //        path: 'login', // auth/login
        //        component: LoginComponent,
        //    },
        //    {
        //        path: 'register', // auth/login
        //        component: RegisterComponent,
        //    },
        //]
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        loadChildren: () => DashboardModule,
    },
    {
        path: '**',
        redirectTo: 'auth',
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
