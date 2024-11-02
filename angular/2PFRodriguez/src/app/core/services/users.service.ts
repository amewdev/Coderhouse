import { Injectable } from '@angular/core';
import { User } from '../../features/dashboard/users/models';
import { concatMap, Observable } from 'rxjs';
import { generateString } from '../../shared/utils';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

/*
let DATABASE: User[] = [
    {
        id: "rcpd83",
        firstName: "Leon Scott",
        lastName: "Kennedy",
        createdAt: new Date(),
        email: "leonskennedy@gmail.com",
        password: "pepino69",
        token: "mkonjibhuvgycftvgybhunjimko",
    },
    {
        id: "pfya29",
        firstName: "Ethan",
        lastName: "Winters",
        createdAt: new Date(),
        email: "ewinterrep@gmail.com",
        password: "CR7cabra",
        token: "zsexdrctfvgyzsevgybhunjixdr",
    },
];
*/

@Injectable({
    providedIn: 'root'
})

export class UsersService {

    private baseURL = environment.apiBaseURL;

    constructor(
        private httpClient: HttpClient,
    ) { }

    createUser(data: Omit<User, 'id'>): Observable<User> {
        return this.httpClient
               .post<User>(`${this.baseURL}/students`, {
                                                            ...data,
                                                            role: "user",
                                                            token: generateString(20),
                                                            password: generateString(8),
                                                            createdAt: new Date().toISOString(),
                                                        }
                );
    }

    getById(id:string): Observable<User | undefined> {
        return this.httpClient.get<User>(`${this.baseURL}/students/${id}`)
    }

    getUsers(): Observable<User[]> {
        return this.httpClient.get<User[]>(`${this.baseURL}/students`);
    }

    removeUserById(id: string): Observable<User[]> {
        return this.httpClient
               .delete<User>(`${this.baseURL}/students/${id}`)
               .pipe(concatMap(() => this.getUsers()));
    }

    updateUserById(id: string, update: Partial<User>) {
        return this.httpClient
               .patch(`${this.baseURL}/students/${id}`,update)
               .pipe(concatMap(() => this.getUsers()));
    }
}
