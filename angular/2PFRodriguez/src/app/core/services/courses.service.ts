import { Injectable } from '@angular/core';
import { Course } from '../../features/dashboard/courses/models';
import { delay, map, Observable, of } from 'rxjs';

let DATABASE: Course[] = [
    {
        id: "1a2ci2",
        name: "Programación 1",
        description: "Se enseña los fundamentos y estructuras básicas de programación",
    },
    {
        id: "2a1ci3",
        name: "Programación 2",
        description: "Se enseñan estructuras dinámicas en C",
    }
];

@Injectable({
    providedIn: 'root'
})

export class CoursesService {

    constructor() { }

    getById(id:string): Observable<Course | undefined> {
        return this.getCourses().pipe(map((courses) => courses.find((c) => c.id === id)));
    }

    getCourses(): Observable<Course[]> {
        return new Observable((observer) => {
            setInterval(() => {
                observer.next(DATABASE);
                observer.complete();
            }, 750)
        })
    }

    removeCourseById(id: string): Observable<Course[]> {
        DATABASE = DATABASE.filter((course) => course.id != id);

        //return new Observable();
        return of(DATABASE).pipe(delay(1000));
    }

    updateCourseById(id: string, update: Partial<Course>) {
        DATABASE = DATABASE.map((course) => course.id === id ? {...course, ...update} : course )

        return new Observable<Course[]>((observer) => {
            setInterval(() => {
                observer.next(DATABASE);
                observer.complete();
            }, 1000);
        })
    }

}
