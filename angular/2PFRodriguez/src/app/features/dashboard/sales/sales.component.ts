import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { SaleActions } from './store/sale.actions';
import { Observable } from 'rxjs';
import { Sale } from './models';
import { selectIsLoadingSales, selectLoadSalesError, selectProductOptions, selectSales, selectStudentOptions } from './store/sale.selectors';
import { Student } from '../students/models';
import { Course } from '../courses/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-sales',
    templateUrl: './sales.component.html',
    styleUrl: './sales.component.scss'
})

export class SalesComponent implements OnInit {

    sales$: Observable<Sale[]>;
    studentOptions$: Observable<Student[]>;
    productOptions$: Observable<Course[]>;
    loadSalesError$: Observable<Error | null>;
    isLoadingSales$: Observable<boolean>;

    saleForm: FormGroup;

    constructor(
        private store: Store,
        private formBuilder: FormBuilder,
    ) {
        this.sales$ = this.store.select(selectSales);
        this.studentOptions$ = this.store.select(selectStudentOptions);
        this.productOptions$ = this.store.select(selectProductOptions);
        this.loadSalesError$ = this.store.select(selectLoadSalesError);
        this.isLoadingSales$ = this.store.select(selectIsLoadingSales);

        this.saleForm = this.formBuilder.group({
            productId: [null, [Validators.required]],
            studentId: [null, [Validators.required]],
        });
    }

    ngOnInit(): void {
        this.store.dispatch(SaleActions.loadSales());
        //this.store.dispatch(SaleActions.loadProductOption());
        //this.store.dispatch(SaleActions.loadStudentOption());
        this.store.dispatch(SaleActions.loadProductsAndStudentOptions());
    }

    onSubmit(): void {
        if (this.saleForm.invalid) {
            this.saleForm.markAllAsTouched();
        } else {
            this.store.dispatch(SaleActions.createSale(this.saleForm.value));
            this.saleForm.reset();
        }
    }

}
