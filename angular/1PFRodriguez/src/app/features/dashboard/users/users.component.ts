import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { User } from './models';

const ELEMENT_DATA: User[] = [
    {
        id: "rcpd83",
        firstName: "Leon Scott",
        lastName: "Kennedy",
        createdAt: new Date(),
        email: "leonskennedy@gmail.com"
    },
    {
        id: "pfya29",
        firstName: "Ethan",
        lastName: "Winters",
        createdAt: new Date(),
        email: "ewinterrep@gmail.com"
    },
];

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

    displayedColumns: string[] = ['id', 'name', 'email', 'doc', 'actions'];
    dataSource = ELEMENT_DATA;

    constructor(private matDialog: MatDialog) {}

    onDelete(id: string) {
        if (confirm('¿Está seguro de querer eliminar este usuario?'))
            this.dataSource = this.dataSource.filter((user) => user.id !== id)
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
                        this.dataSource = this.dataSource.map((user) => user.id === editingUser.id ? {...user, ...result} : user )
                    else
                        this.dataSource = [...this.dataSource, result];
                }
            }
        });
    }
}
