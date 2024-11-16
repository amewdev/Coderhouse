import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { StudentsModule } from './students/students.module';
import { SharedModule } from '../../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { CoursesModule } from './courses/courses.module';

@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    SharedModule,
    StudentsModule,
  ],
  exports: [
    DashboardComponent,
  ]
})
export class DashboardModule {

}
