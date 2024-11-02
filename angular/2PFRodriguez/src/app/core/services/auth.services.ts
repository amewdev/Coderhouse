import { Injectable } from "@angular/core";
import { AuthData } from "../../features/auth/models";
import { BehaviorSubject, map, Observable, of, throwError } from "rxjs";
import { User } from "../../features/dashboard/users/models";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root',
})

export class AuthService {

    private _authUser$ = new BehaviorSubject<null | User>(null);
    public authUser$ = this._authUser$.asObservable();

    private baseURL = environment.apiBaseURL;

    constructor(
        private router: Router,
        private httpClient: HttpClient,
    ) {}

    private handleAuth(students: User[]): User | null {
        if (!!students[0]) {
            this._authUser$.next(students[0]);
            localStorage.setItem('token',students[0].token);
            return students[0];
        } else {
            return null;
        }
    }

    login(data: AuthData): Observable<User> {
        return this.httpClient.get<User[]>(`${this.baseURL}/students?email=${data.email}&password=${data.password}`)
                              .pipe(map((students) => {
                                    const student = this.handleAuth(students);
                                    if (student)
                                        return student
                                    else
                                        throw throwError(() => new Error('Datos inválidos'))
                                }));
    }

    logout() {
        this._authUser$.next(null);
        localStorage.removeItem('token');
        this.router.navigate(['auth','login'])
    }

    verifyToken(): Observable<boolean> {
        return this.httpClient.get<User[]>(`${this.baseURL}/students?token=${localStorage.getItem('token')}`)
                              .pipe(map((students) => {
                                    const student = this.handleAuth(students);
                                    return !!student;
                              }));
    }
}