import { Injectable } from "@angular/core";
import { AuthData } from "../../features/auth/models";
import { Observable, of, throwError } from "rxjs";
import { User } from "../../features/dashboard/users/models";
import { generateString } from "../../shared/utils";

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
    login(data: AuthData): Observable<User> {
        if (data.email != FAKE_USER.email || data.password != FAKE_USER.password)
            return throwError(() => new Error('datos inválidos'))
        else
            return of(FAKE_USER)
    }
}