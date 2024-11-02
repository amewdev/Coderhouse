import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CourseDialogComponent } from './course-dialog/course-dialog.component';
import { Course } from './models';
import { CoursesService } from '../../../core/services/courses.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})

export class CoursesComponent {

    courses$: Observable<Course[]>;

    displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
    dataSource: Course[] = [];

    isLoading = false;

    constructor(
        private matDialog: MatDialog,
        private courseService: CoursesService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {
        this.courses$ = this.courseService.getCourses();
    }

    loadCourses(): void {
        this.isLoading = true;
        this.courseService.getCourses().subscribe({
            next: (courses) => {
                this.dataSource = courses;
            },
            error: () => {
                this.isLoading = false;
            },
            complete: () => {
                this.isLoading = false;
            },
        })
    }

    ngOnInit(): void {
        this.loadCourses();
    }

    onDelete(id: string) {
        if (confirm('¿Está seguro de querer eliminar este usuario?'))
            this.dataSource = this.dataSource.filter((user) => user.id !== id)
    }

    goToDetail(userId:string): void {
        this.router.navigate([userId,'detail'],{ relativeTo: this.activatedRoute });
    }

    openModal(editingCourse?: Course): void {
        this.matDialog
        .open(CourseDialogComponent, {
            data: {
                editingCourse,
            },
        })
        .afterClosed()
        .subscribe({
            next: (result) => {
                console.log("Recibimos : ",result);
                if (!!result) {
                    if (editingCourse)
                        this.dataSource = this.dataSource.map((course) => course.id === editingCourse.id ? {...course, ...result} : course )
                    else
                        this.dataSource = [...this.dataSource, result];
                }
            }
        });
    }

    handleUpdate(id: string, update: Course): void {
        this.isLoading = true;

        this.courseService.updateCourseById(id, update).subscribe({
            next: (courses) => {
                this.dataSource = courses;
            },
            error: (err) => {
                this.isLoading = false;
            },
            complete: () => {
                this.isLoading = false;
            }
        })
    }
}
