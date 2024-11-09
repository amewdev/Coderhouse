import { createReducer, on } from "@ngrx/store";
import { restar, sumar } from "../actions/counter/counter.actions";

export interface CounterState {
    value: number;
};

export const counterFeatureName = 'counter';

const initialState = {
    value: 0,
};

export const counterReducer = createReducer(
                                        initialState,
                                        on(sumar, (state) => {
                                            return {
                                                value: state.value + 1
                                            }
                                        }),
                                        on(restar, (state) => {
                                            return {
                                                ...state,
                                                value: state.value-1,
                                            }
                                        })
                              );