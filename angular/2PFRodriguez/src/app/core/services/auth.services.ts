import { Injectable } from "@angular/core";
import { AuthData } from "../../features/auth/models";
import { BehaviorSubject, map, Observable, of, throwError } from "rxjs";
import { Student } from "../../features/dashboard/students/models";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Store } from "@ngrx/store";
import { AuthActions } from "../../store/actions/auth.actions";
import { selectAuthenticatedStudent } from "../../store/selector/auth.selectors";

@Injectable({
    providedIn: 'root',
})

export class AuthService {

    //private _authStudent$ = new BehaviorSubject<null | Student>(null);
    public authStudent$: Observable< Student | null >;

    private baseURL = environment.apiBaseURL;

    constructor(
        private router: Router,
        private httpClient: HttpClient,
        private store: Store,
    ) {
        this.authStudent$ = this.store.select(selectAuthenticatedStudent);
    }

    private handleAuth(students: Student[]): Student | null {
        if (!!students[0]) {
            //this._authStudent$.next(students[0]);
            this.store.dispatch(AuthActions.setAuthenticatedStudent({student: students[0]}));
            localStorage.setItem('token',students[0].token);
            return students[0];
        } else {
            return null;
        }
    }

    login(data: AuthData): Observable<Student> {
        return this.httpClient.get<Student[]>(`${this.baseURL}/students?email=${data.email}&password=${data.password}`)
                              .pipe(map((students) => {
                                    const student = this.handleAuth(students);
                                    if (student)
                                        return student
                                    else
                                        throw new Error('Datos inválidos')
                               }));
    }

    logout() {
        //this._authStudent$.next(null);
        this.store.dispatch(AuthActions.unsetAuthenticatedStudent());
        localStorage.removeItem('token');
        this.router.navigate(['auth','login']);
    }

    verifyToken(): Observable<boolean> {
        return this.httpClient.get<Student[]>(`${this.baseURL}/students?token=${localStorage.getItem('token')}`)
                              .pipe(map((students) => {
                                    const student = this.handleAuth(students);
                                    return !!student;
                              }));
    }
}