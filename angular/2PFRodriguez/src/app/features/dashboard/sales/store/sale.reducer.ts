import { createFeature, createReducer, on } from '@ngrx/store';
import { SaleActions } from './sale.actions';
import { Sale } from '../models';
import { Course } from '../../courses/models';
import { Student } from '../../students/models';
import { generate } from 'rxjs';
import { generateString } from '../../../../shared/utils';

export const saleFeatureKey = 'sale';

export interface State {
    isLoadingSales: boolean;
    loadSalesError: Error | null;
    sales: Sale[];
    productOptions: Course[];
    studentOptions: Student[];
}

export const initialState: State = {
    isLoadingSales: false,
    loadSalesError: null,
    sales: [],
    productOptions: [],
    studentOptions: [],
};

export const reducer = createReducer(
    initialState,
    on(
        SaleActions.createSale,
        (state) => {
            return {
                ...state,
                isLoadingSales: true,
            }
        }
    ),
    on(
        SaleActions.loadSales,
        (state) => {
            return {
                ...state,
                isLoadingSales: true,
            }
        }
    ),
    on(
        SaleActions.loadSalesSuccess,
        (state, action) => {
            return {
                ...state,
                sales: action.data,
                isLoadingSales: false,
                loadSalesError: null,
            }
        }
    ),
    on(
        SaleActions.loadSalesFailure,
        (state, action) => {
            return {
                ...state,
                ...initialState,
                isLoadingSales: false,
                loadSalesError: action.error,
            }
        }
    ),
    on(
        SaleActions.loadProductsAndStudentOptions,
        (state) => {
            return {
                ...state,
                isLoadingSales: true,
            }
        }
    ),
    on(
        SaleActions.loadProductsAndStudentOptionsSuccess,
        (state, action) => {
            return {
                ...state,
                isLoadingSales: false,
                loadSalesError: null,
                productOptions: action.products,
                studentOptions: action.students,
            }
        }
    ),
    on(
        SaleActions.loadProductsAndStudentOptionsFailure,
        (state, { error }) => {
            return {
                ...state,
                isLoadingSales: false,
                loadSalesError: error,
            }
        }
    ),
);

export const saleFeature = createFeature({
    name: saleFeatureKey,
    reducer,
});

