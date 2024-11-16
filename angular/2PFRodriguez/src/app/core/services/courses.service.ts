import { Injectable } from '@angular/core';
import { Course } from '../../features/dashboard/courses/models';
import { concatMap, Observable } from 'rxjs';
import { generateString } from '../../shared/utils';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class CoursesService {

    private baseURL = environment.apiBaseURL;

    constructor(
        private httpClient: HttpClient,
    ) { }

    createCourse(data: Omit<Course, 'id'>): Observable<Course> {
        return this.httpClient
               .post<Course>(`${this.baseURL}/courses`, {
                                                            ...data,
                                                            id: generateString(6),
                                                            price: 10,
                                                        }
                );
    }

    getById(id:string): Observable<Course | undefined> {
        return this.httpClient.get<Course>(`${this.baseURL}/courses/${id}`)
    }

    getCourses(): Observable<Course[]> {
        return this.httpClient.get<Course[]>(`${this.baseURL}/courses`);
    }

    removeCourseById(id: string): Observable<Course[]> {
        return this.httpClient
               .delete<Course>(`${this.baseURL}/courses/${id}`)
               .pipe(concatMap(() => this.getCourses()));
    }

    updateCourseById(id: string, update: Partial<Course>) {
        return this.httpClient
               .patch(`${this.baseURL}/courses/${id}`,update)
               .pipe(concatMap(() => this.getCourses()));
    }
}
