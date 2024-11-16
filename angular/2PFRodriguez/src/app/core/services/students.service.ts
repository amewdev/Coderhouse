import { Injectable } from '@angular/core';
import { Student } from '../../features/dashboard/students/models';
import { concatMap, Observable } from 'rxjs';
import { generateString } from '../../shared/utils';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class StudentsService {

    private baseURL = environment.apiBaseURL;

    constructor(
        private httpClient: HttpClient,
    ) { }

    createStudent(data: Omit<Student, 'id'>): Observable<Student> {
        return this.httpClient
               .post<Student>(`${this.baseURL}/students`, {
                                                            ...data,
                                                            role: "user",
                                                            token: generateString(20),
                                                            password: generateString(8),
                                                            createdAt: new Date().toISOString(),
                                                        }
                );
    }

    getById(id:string): Observable<Student | undefined> {
        return this.httpClient.get<Student>(`${this.baseURL}/students/${id}`)
    }

    getStudents(): Observable<Student[]> {
        return this.httpClient.get<Student[]>(`${this.baseURL}/students`);
    }

    removeStudentById(id: string): Observable<Student[]> {
        return this.httpClient
               .delete<Student>(`${this.baseURL}/students/${id}`)
               .pipe(concatMap(() => this.getStudents()));
    }

    updateStudentById(id: string, update: Partial<Student>) {
        return this.httpClient
               .patch(`${this.baseURL}/students/${id}`,update)
               .pipe(concatMap(() => this.getStudents()));
    }
}
