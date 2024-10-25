import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { generateString } from '../../../../shared/utils';
import { Course } from '../models/index';

interface CourseDialogData {
    editingCourse?: Course,
}

@Component({
  selector: 'app-course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrl: './course-dialog.component.scss',
})

export class CourseDialogComponent {
    courseForm: FormGroup;
    userForm: any;

    constructor(
        private matDialogRef: MatDialogRef<CourseDialogComponent>,
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data?:CourseDialogData,
    ) {
        this.courseForm = this.formBuilder.group({
            name: [null, [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s]+$/)]],
            description: [null, [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s]+$/)]],
        });
        this.patchFormValue();
    }

    patchFormValue() {
        if (this.data?.editingCourse)
            this.courseForm.patchValue(this.data.editingCourse);
    }

    onSave():void {
        if (this.courseForm.invalid)
            this.courseForm.markAllAsTouched()
        else {
            this.matDialogRef.close({
                ...this.courseForm.value,
                id: this.data?.editingCourse ? this.data?.editingCourse.id : generateString(6),
            });
        }
    }
}
