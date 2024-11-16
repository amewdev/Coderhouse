import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StudentDialogComponent } from './student-dialog/student-dialog.component';
import { Student } from './models';
import { StudentsService } from '../../../core/services/students.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss'
})

export class StudentsComponent {

    displayedColumns: string[] = ['id', 'name', 'email', 'doc', 'actions'];
    dataSource: Student[] = [];

    isLoading = false;

    authStudent$: Observable<Student | null>;

    constructor(
        private matDialog: MatDialog,
        private studentService: StudentsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
    ) {
        this.authStudent$ = this.authService.authStudent$;
    }

    loadStudents(): void {
        this.isLoading = true;
        this.studentService.getStudents().subscribe({
            next: (students) => {
                this.dataSource = students;
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
        this.loadStudents();
    }

    onDelete(id: string) {
        if (confirm('¿Está seguro de querer eliminar este usuario?')) {
            this.isLoading = true;
            this.studentService.removeStudentById(id).subscribe({
                next: (students) => {
                    this.dataSource = students
                },
                error: (err) => {
                    this.isLoading = false
                },
                complete: () => {
                    this.isLoading = false
                }
            });
        }
    }

    goToDetail(studentId:string): void {
        this.router.navigate([studentId,'detail'],{ relativeTo: this.activatedRoute });
    }

    openModal(editingStudent?: Student): void {
        this.matDialog
        .open(StudentDialogComponent, {
            data: {
                editingStudent,
            },
        })
        .afterClosed()
        .subscribe({
            next: (result) => {
                console.log("Recibimos : ",result);
                if (!!result) {
                    if (editingStudent)
                        this.handleUpdate(editingStudent.id, result);
                    else
                        this.studentService
                        .createStudent(result)
                        .subscribe({ next: () => this.loadStudents() })
                }
            }
        });
    }

    handleUpdate(id: string, update: Student): void {
        this.isLoading = true;

        this.studentService.updateStudentById(id, update).subscribe({
            next: (students) => {
                this.dataSource = students;
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
