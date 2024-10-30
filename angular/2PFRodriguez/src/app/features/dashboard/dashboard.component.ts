import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.services';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from './users/models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
    showFiller = false;

    authUser$: Observable<User | null>;

    constructor(
        private router: Router,
        private authService: AuthService,
    ) {
        this.authUser$ = this.authService.authUser$;
    }

    logout(): void {
        this.authService.logout();
    }

}
