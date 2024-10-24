import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { generateString } from '../../../../shared/utils';
import { User } from '../models/index';

interface UserDialogData {
    editingUser?: User,
}

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.scss',
})
export class UserDialogComponent {
    userForm: FormGroup;

    constructor(
        private matDialogRef: MatDialogRef<UserDialogComponent>,
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data?:UserDialogData,
    ) {
        this.userForm = this.formBuilder.group({
            firstName: [null, [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s]+$/)]],
            lastName: [null, [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s]+$/)]],
            email: [null, [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
        });
        this.patchFormValue();
    }

    patchFormValue() {
        if (this.data?.editingUser)
            this.userForm.patchValue(this.data.editingUser);
    }

    onSave():void {
        if (this.userForm.invalid)
            this.userForm.markAllAsTouched()
        else {
            this.matDialogRef.close({
                ...this.userForm.value,
                id: this.data?.editingUser ? this.data?.editingUser.id : generateString(6),
                createdAt: this.data?.editingUser ? this.data?.editingUser.createdAt : new Date(),
            });
        }
    }
}
