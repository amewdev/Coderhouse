import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Sale } from '../models';
import { Student } from '../../students/models';
import { Course } from '../../courses/models';

export const SaleActions = createActionGroup({
    source: 'Sale',
    events: {
        'Create Sale': props<{ productId: string, studentId: string }>(),
        'Create Sale Success' : props<{ data: Sale }>(),
        'Create Sale Failure' : props<{ error: Error }>(),

        'Load Sales': emptyProps(),
        'Load Sales Success' : props<{ data: Sale[] }>(),
        'Load Sales Failure' : props<{ error: Error }>(),

        'Load Product Option': emptyProps(),
        //'Load Product Options Success': emptyProps(),
        //'Load Product Options Failure': emptyProps(),

        'Load Student Option': emptyProps(),
        //'Load Student Options Success': emptyProps(),
        //'Load Student Options Failure': emptyProps(),

        'Load Products and Student Options': emptyProps(),
        'Load Products and Student Options Success': props<{ students: Student[], products: Course[] }>(),
        'Load Products and Student Options Failure': props<{ error: Error }>(),
    },
});
