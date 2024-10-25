import { Injectable } from '@angular/core';
import { User } from '../../features/dashboard/users/models';
import { delay, map, Observable, of } from 'rxjs';

let DATABASE: User[] = [
    {
        id: "rcpd83",
        firstName: "Leon Scott",
        lastName: "Kennedy",
        createdAt: new Date(),
        email: "leonskennedy@gmail.com"
    },
    {
        id: "pfya29",
        firstName: "Ethan",
        lastName: "Winters",
        createdAt: new Date(),
        email: "ewinterrep@gmail.com"
    },
];

@Injectable({
    providedIn: 'root'
})

export class UsersService {
    addUser(result: any) {
        throw new Error('Method not implemented.');
    }

    constructor() { }

    getById(id:string): Observable<User | undefined> {
        return this.getUsers().pipe(map((users) => users.find((u) => u.id === id)));
    }

    getUsers(): Observable<User[]> {
        return new Observable((observer) => {
            setInterval(() => {
                observer.next(DATABASE);
                //observer.error('Error al cargar');
                observer.complete();
            }, 750)
        })
    }

    removeUserById(id: string): Observable<User[]> {
        DATABASE = DATABASE.filter((user) => user.id != id);

        //return new Observable();
        return of(DATABASE).pipe(delay(1000));
    }

    updateUserById(id: string, update: Partial<User>) {
        DATABASE = DATABASE.map((user) => user.id === id ? {...user, ...update} : user )

        return new Observable<User[]>((observer) => {
            setInterval(() => {
                observer.next(DATABASE);
                observer.complete();
            }, 1000);
        })
    }

}
