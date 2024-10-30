import { Injectable } from "@angular/core";
import { AuthData } from "../../features/auth/models";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { User } from "../../features/dashboard/users/models";
import { generateString } from "../../shared/utils";
import { Router } from "@angular/router";

const FAKE_USER: User = {
    email: 'admin@mail.com',
    password: '123456',
    firstName: 'admin',
    lastName: 'admin',
    id: generateString(6),
    createdAt: new Date(),
}

@Injectable({
    providedIn: 'root',
})

export class AuthService {

    private _authUser$ = new BehaviorSubject<null | User>(null);
    public authUser$ = this._authUser$.asObservable();

    constructor(
        private router: Router,
    ) {}

    login(data: AuthData): Observable<User> {
        if (data.email != FAKE_USER.email || data.password != FAKE_USER.password)
            return throwError(() => new Error('datos inválidos'));

        this._authUser$.next(FAKE_USER);
        return of(FAKE_USER);
    }

    logout() {
        this._authUser$.next(null);
        this.router.navigate(['auth','login'])
    }
}