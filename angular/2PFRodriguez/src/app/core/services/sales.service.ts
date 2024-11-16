import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Sale } from "../../features/dashboard/sales/models";

@Injectable({
    providedIn: 'root',
})

export class SalesService {

    constructor (
        private httpClient: HttpClient,
    ) {}

    getSales(): Observable<Sale[]> {
        return this.httpClient.get<Sale[]>(`${environment.apiBaseURL}/sales`); //?_embed=student`)
    }

    createSale(payload: Omit<Sale, 'id' | 'student' | 'product'>): Observable<Sale> {
        return this.httpClient.post<Sale>(
            `${environment.apiBaseURL}/sales`,
            payload
        );
    }

}