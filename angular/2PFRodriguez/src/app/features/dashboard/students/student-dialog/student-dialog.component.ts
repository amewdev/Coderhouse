import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { generateString } from '../../../../shared/utils';
import { Student } from '../models/index';

interface StudentDialogData {
    editingStudent?: Student,
}

@Component({
  selector: 'app-student-dialog',
  templateUrl: './student-dialog.component.html',
  styleUrl: './student-dialog.component.scss',
})
export class StudentDialogComponent {
    studentForm: FormGroup;

    constructor(
        private matDialogRef: MatDialogRef<StudentDialogComponent>,
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data?:StudentDialogData,
    ) {
        this.studentForm = this.formBuilder.group({
            firstName: [null, [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s]+$/)]],
            lastName: [null, [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s]+$/)]],
            email: [null, [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
        });
        this.patchFormValue();
    }

    patchFormValue() {
        if (this.data?.editingStudent)
            this.studentForm.patchValue(this.data.editingStudent);
    }

    onSave():void {
        if (this.studentForm.invalid)
            this.studentForm.markAllAsTouched()
        else {
            this.matDialogRef.close({
                ...this.studentForm.value,
                id: this.data?.editingStudent ? this.data?.editingStudent.id : generateString(6),
                createdAt: this.data?.editingStudent ? this.data?.editingStudent.createdAt : new Date(),
            });
        }
    }
}
