import { createAction, createActionGroup, emptyProps, props } from "@ngrx/store";
import { Student } from "../../features/dashboard/students/models";

export const AuthActions = createActionGroup(
    {
        source: 'Auth',
        events: {
            'Set Authenticated Student': props<{ student: Student }>(),
            'Unset Authenticated Student': emptyProps(),
        }
    },
);