import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { restar, sumar } from '../../../store/actions/counter/counter.actions';
import { selectCounterValue } from '../../../store/selector/counter.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {

    value$: Observable<number>;

    constructor (
        private store: Store,
    ) {
        this.value$ = this.store.select(selectCounterValue);
    }

    onRestar(): void {
        this.store.dispatch(restar());
    }

    onSumar(): void {
        this.store.dispatch(sumar());
    }

}
