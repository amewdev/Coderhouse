import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentsService } from '../../../../core/services/students.service';
import { Student } from '../models';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrl: './student-detail.component.scss'
})
export class StudentDetailComponent implements OnInit {

    studentId?: string;

    student?: Student;

    isLoading = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        private studentsService: StudentsService,
    ) {
        console.log('La ruta activa es : ', activatedRoute);
        this.studentId = activatedRoute.snapshot.params['id'];
    }
    ngOnInit(): void {
        this.isLoading = true;
        this.studentsService
            .getById(this.activatedRoute.snapshot.params['id'])
            .subscribe({
                next: (student) => {
                    this.student = student;
                    this.isLoading = false;
                }
        });
    }

}
