import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { User } from './models';
import { UsersService } from '../../../core/services/users.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

    displayedColumns: string[] = ['id', 'name', 'email', 'doc', 'actions'];
    dataSource: User[] = [];

    isLoading = false;

    constructor(
        private matDialog: MatDialog,
        private userService: UsersService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {}

    loadUsers(): void {
        this.isLoading = true;
        this.userService.getUsers().subscribe({
            next: (users) => {
                this.dataSource = users;
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
        this.loadUsers();
    }

    onDelete(id: string) {
        if (confirm('¿Está seguro de querer eliminar este usuario?')) {
            //this.dataSource = this.dataSource.filter((user) => user.id !== id)
            this.isLoading = true;
            this.userService.removeUserById(id).subscribe({
                next: (users) => {
                    this.dataSource = users;
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

    goToDetail(userId:string): void {
        this.router.navigate([userId,'detail'],{ relativeTo: this.activatedRoute });
    }

    openModal(editingUser?: User): void {
        this.matDialog
        .open(UserDialogComponent, {
            data: {
                editingUser,
            },
        })
        .afterClosed()
        .subscribe({
            next: (result) => {
                console.log("Recibimos : ",result);
                if (!!result) {
                    if (editingUser)
                        this.handleUpdate(editingUser.id, result);
                    else
                        this.dataSource = [...this.dataSource, result];
                }
            }
        });
    }

    handleUpdate(id: string, update: User): void {
        this.isLoading = true;

        this.userService.updateUserById(id, update).subscribe({
            next: (users) => {
                this.dataSource = users;
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
