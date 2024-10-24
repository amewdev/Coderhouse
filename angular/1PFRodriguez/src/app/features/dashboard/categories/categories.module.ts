import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './categories.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { CategoriesTableComponent } from './categories-table/categories-table.component';
import { SharedModule } from '../../../shared/shared.module';


@NgModule({
    declarations: [
        CategoriesComponent,
        CategoryDetailComponent,
        CategoriesTableComponent
    ],
    imports: [
        CommonModule,
        CategoriesRoutingModule,
        SharedModule
    ]
})
export class CategoriesModule { }
