import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, concatMap, delay, map } from 'rxjs/operators';
import { Observable, EMPTY, of, forkJoin } from 'rxjs';
import { SaleActions } from './sale.actions';
import { SalesService } from '../../../../core/services/sales.service';
import { Action } from '@ngrx/store';
import { Student } from '../../students/models';
import { StudentsService } from '../../../../core/services/students.service';
import { CoursesService } from '../../../../core/services/courses.service';

@Injectable()
export class SaleEffects {

    loadSales$: Actions<Action<string>>;
    //loadStudentsAndProductsSuccess$: Actions<Action<string>>;
    createSale$: Actions<Action<string>>;
    createSaleSuccess$: Actions<Action<string>>;
    loadProductsAndStudentsOptions$: Actions<Action<string>>;

    constructor(
        private actions$: Actions,
        private salesService: SalesService,
        private studentsService: StudentsService,
        private productsService: CoursesService,
    ) {
        this.loadSales$ = createEffect(
            () => {
                return this.actions$.pipe(
                    ofType(SaleActions.loadSales),
                    //An EMPTY observable only emits completion. Replace with your own observable API request
                    //concatMap(() => EMPTY as Observable<{ type: string }>)
                    //delay(1000),
                    concatMap(() => this.salesService
                                        .getSales()
                                        .pipe(
                                            // Success
                                            map((response) => SaleActions.loadSalesSuccess({ data: response })),
                                            // Fail
                                            catchError((error) => of(SaleActions.loadSalesFailure({error})))
                                        )
                    )
                );
            }
        );

        this.createSale$ = createEffect(
            () => {
                return this.actions$.pipe(
                    ofType(SaleActions.createSale),
                    concatMap((action) => this.salesService
                                            .createSale(
                                                {
                                                    productId: action. productId,
                                                    studentId: action.studentId,
                                                }
                                            )
                                            .pipe(
                                                map((data) => SaleActions.createSaleSuccess({ data })),
                                                catchError((error) => of(SaleActions.createSaleFailure({error})))
                                            )
                    )
                )
            }
        )

        this.createSaleSuccess$ = createEffect(() => {
            return this.actions$.pipe(
                ofType(SaleActions.createSaleSuccess),
                map(() => SaleActions.loadSales())
            )
        })

        this.loadProductsAndStudentsOptions$ = createEffect(
            () => {
                return this.actions$.pipe(
                    ofType(SaleActions.loadProductsAndStudentOptions),
                    concatMap(() => forkJoin([
                        this.productsService.getCourses(),
                        this.studentsService.getStudents(),
                    ]).pipe(
                        map((res) => SaleActions.loadProductsAndStudentOptionsSuccess({
                                                                                        products: res[0],
                                                                                        students: res[1],
                                                                                    }
                        ))
                    )),
                    catchError((error) => of(SaleActions.loadProductsAndStudentOptionsFailure({error}))),
                )
            }
        )

    }
}
