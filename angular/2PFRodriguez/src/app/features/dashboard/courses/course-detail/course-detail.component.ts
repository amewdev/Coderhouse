import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoursesService } from '../../../../core/services/courses.service';
import { Course } from '../models';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss'
})
export class CourseDetailComponent implements OnInit {

    courseId?: string;

    course?: Course;

    isLoading = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        private coursesService: CoursesService,
    ) {
        console.log('La ruta activa es : ', activatedRoute);
        this.courseId = activatedRoute.snapshot.params['id'];
    }

    ngOnInit(): void {
        this.isLoading = true;
        this.coursesService
            .getById(this.activatedRoute.snapshot.params['id'])
            .subscribe({
                next: (course) => {
                    this.course = course;
                    this.isLoading = false;
                }
        });
    }
}
